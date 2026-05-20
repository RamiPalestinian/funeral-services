// Сервис для работы с AI (GigaChat + RAG)
// Объединяет обычный чат с GigaChat и поиск по базе знаний (RAG)

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Agent } from 'node:https';
import GigaChat from 'gigachat';
import { InferenceClient } from '@huggingface/inference';
import * as fs from 'fs/promises';
import * as path from 'path';

// Тип для хранения одного сообщения в истории чата
// role: 'user' - написал пользователь, 'assistant' - ответил бот
type ChatHistoryMessage = {
  role: 'user' | 'assistant';
  content: string;
};

// Тип для данных, которые приходят от клиента
type SendMessageDto = {
  message: string; // Текст вопроса от пользователя
  userName?: string; // Имя пользователя (по умолчанию 'посетитель')
  history?: ChatHistoryMessage[]; // Предыдущие сообщения для контекста диалога
};

// Тип для хранения одного фрагмента текста из базы знаний
type VectorStorage = {
  text: string; // Сам текст фрагмента
};

type RagSearchResult = {
  chunks: string[];
  maxScore: number;
};

const OFF_TOPIC_REPLY =
  'К сожалению, я не могу ответить на этот вопрос — я консультирую только по услугам ритуальной службы «Пантеон»: похороны, кремация, документы, транспорт и ориентиры по стоимости. Посмотрите раздел «Наши услуги» на сайте или свяжитесь с оператором. Задайте, пожалуйста, другой вопрос по нашим услугам.';

// Если в вопросе есть эти слова — считаем тему ритуальной службы, даже при слабом RAG
const FUNERAL_TOPIC_RE =
  /похорон|кремац|ритуал|гроб|венок|захорон|документ|транспорт|ислам|услуг|пакет|стоимост|цен[аыуе]|оператор|пантеон|умер|смерт|справк|свидетельств|морг|кладбищ|первые\s+час|организац/i;

@Injectable()
export class AiService implements OnModuleInit {
  private readonly logger = new Logger(AiService.name);

  // GigaChat - нейросеть от Сбера для генерации ответов
  private readonly gigaChat: GigaChat;

  // HuggingFace клиент - для поиска похожих фрагментов в базе знаний
  private readonly hfClient: InferenceClient;

  // Массив для хранения всех фрагментов из файлов базы знаний
  private vectorStorage: VectorStorage[] = [];

  // Максимальный размер одного фрагмента текста в символах
  private chunkSize: number = 500;

  // Сколько самых похожих фрагментов отправить в GigaChat
  private topP: number = 3;

  // Минимальная похожесть с базой знаний; ниже — вопрос считаем оффтопом
  private ragMinRelevanceScore: number = 0.38;

  // Путь к папке с файлами базы знаний
  private knowledgeBasePath: string = './knowledge-base';

  // Конструктор - настройка сервиса при запуске
  constructor(private readonly configService: ConfigService) {
    // Настраиваем HTTPS соединение (отключаем проверку сертификата для локальной разработки)
    const httpsAgent = new Agent({
      rejectUnauthorized: false,
    });

    // Инициализируем GigaChat с API ключом из .env файла
    this.gigaChat = new GigaChat({
      model: 'GigaChat',
      credentials: this.configService.get<string>('GIGACHAT_API_KEY'),
      httpsAgent,
    });

    // Получаем токен HuggingFace из .env файла
    const hfToken = this.configService.get<string>('HF_TOKEN');
    if (!hfToken) {
      // Если токена нет - сервис не сможет работать, выбрасываем ошибку
      const error = 'Ошибка: HF_TOKEN не найден в .env! RAG не будет работать';
      this.logger.error(error);
      throw new Error(error);
    }

    // Создаем клиента HuggingFace с полученным токеном
    this.hfClient = new InferenceClient(hfToken);

    // Загружаем настройки из .env или оставляем значения по умолчанию
    this.chunkSize = this.configService.get<number>('RAG_CHUNK_SIZE') || 500;
    this.topP = this.configService.get<number>('RAG_TOP_P') || 3;
    this.ragMinRelevanceScore =
      this.configService.get<number>('RAG_MIN_RELEVANCE_SCORE') ?? 0.38;
    this.knowledgeBasePath =
      this.configService.get<string>('KNOWLEDGE_BASE_PATH') ||
      './knowledge-base';
  }

  // Вызывается автоматически при запуске приложения
  // Загружаем все файлы из папки knowledge-base в память
  async onModuleInit() {
    try {
      await this.loadKnowledgeBase();
      this.logger.log(
        `RAG инициализирован: загружено ${this.vectorStorage.length} фрагментов`,
      );
    } catch (error) {
      this.logger.error('Ошибка загрузки базы знаний', error);
    }
  }

  // Сравнивает вопрос пользователя со всеми фрагментами
  // Возвращает массив чисел от 0 до 1, где 1 - идеальное совпадение
  private async getSimilarity(
    sourceText: string, // Вопрос пользователя
    sentences: string[], // Массив всех фрагментов из базы знаний
  ): Promise<number[]> {
    try {
      // Отправляем запрос в HuggingFace для сравнения текстов
      const result = await this.hfClient.sentenceSimilarity({
        model: 'intfloat/multilingual-e5-small', // Модель поддерживает русский язык
        inputs: {
          source_sentence: sourceText,
          sentences: sentences,
        },
        provider: 'hf-inference',
      });
      return result;
    } catch (error) {
      this.logger.error('Ошибка в getSimilarity', error);
      throw error;
    }
  }

  // Читает все файлы .txt и .md из папки knowledge-base
  private async loadKnowledgeBase() {
    try {
      // Получаем список всех файлов в папке
      const files = await fs.readdir(this.knowledgeBasePath);

      // Проходим по каждому файлу
      for (const file of files) {
        // Проверяем расширение файла
        if (file.endsWith('.txt') || file.endsWith('.md')) {
          const filePath = path.join(this.knowledgeBasePath, file);
          await this.indexFile(filePath);
          this.logger.log(`Загружен файл: ${file}`);
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки базы знаний', error);
    }
  }

  // Разбивает большой текст на маленькие фрагменты по предложениям
  // Каждый фрагмент не больше chunkSize символов
  private getTextChunks(text: string): string[] {
    // Разбиваем текст на отдельные предложения (. ! ?)
    const sentences = text.match(/[^.!?]+[.!?]+/gm) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    // Группируем предложения в фрагменты
    for (const sentence of sentences) {
      // Если текущий фрагмент + новое предложение слишком большие
      if (currentChunk.length + sentence.length > this.chunkSize) {
        // Сохраняем текущий фрагмент
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
        }
        // Начинаем новый фрагмент с этого предложения
        currentChunk = sentence;
      } else {
        // Добавляем предложение к текущему фрагменту
        currentChunk += sentence + ' ';
      }
    }

    // Сохраняем последний фрагмент
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  // Читает один файл, разбивает на чанки и добавляет в хранилище
  private async indexFile(filePath: string): Promise<number> {
    // Читаем содержимое файла
    const fileContent = await fs.readFile(filePath, 'utf-8');
    // Разбиваем на маленькие фрагменты
    const chunks = this.getTextChunks(fileContent);
    // Добавляем все фрагменты в общее хранилище
    this.vectorStorage.push(...chunks.map((chunk) => ({ text: chunk })));
    // Возвращаем количество добавленных фрагментов
    return chunks.length;
  }

  // Находит topP самых похожих фрагментов и максимальную оценку похожести
  private async findRelevantChunks(query: string): Promise<RagSearchResult> {
    if (this.vectorStorage.length === 0) {
      this.logger.warn('Векторное хранилище пусто');
      return { chunks: [], maxScore: 0 };
    }

    const textFragments = this.vectorStorage.map((item) => item.text);
    const similarity = await this.getSimilarity(query, textFragments);

    const rankedSimilarity = similarity
      .map((score, index) => ({
        text: textFragments[index],
        score,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, this.topP);

    return {
      chunks: rankedSimilarity.map((item) => item.text),
      maxScore: rankedSimilarity[0]?.score ?? 0,
    };
  }

  private mentionsFuneralTopic(message: string): boolean {
    return FUNERAL_TOPIC_RE.test(message);
  }

  private isOffTopicMessage(message: string, maxRagScore: number): boolean {
    if (this.mentionsFuneralTopic(message)) {
      return false;
    }

    return maxRagScore < this.ragMinRelevanceScore;
  }

  // Получает контекст из базы знаний для вопроса пользователя
  private async getRagContext(query: string): Promise<{
    context: string;
    maxScore: number;
  }> {
    const { chunks, maxScore } = await this.findRelevantChunks(query);

    if (chunks.length === 0) {
      return { context: '', maxScore };
    }

    return {
      context: chunks.join('\n---\n'),
      maxScore,
    };
  }

  // Главный метод - отправляет сообщение в GigaChat с контекстом из RAG
  async sendMessage({
    message,
    userName = 'посетитель',
    history = [],
  }: SendMessageDto): Promise<string> {
    try {
      const { context: ragContext, maxScore } =
        await this.getRagContext(message);

      if (this.isOffTopicMessage(message, maxScore)) {
        this.logger.log(
          `Оффтоп-вопрос отклонён (maxScore=${maxScore.toFixed(3)}, порог=${this.ragMinRelevanceScore})`,
        );
        return OFF_TOPIC_REPLY;
      }

      if (ragContext) {
        this.logger.log(
          `Найден RAG контекст: ${ragContext.length} символов, maxScore=${maxScore.toFixed(3)}`,
        );
      } else {
        this.logger.log('RAG контекст не найден');
      }

      // Отправляем запрос в GigaChat
      // В запросе передаем: системный промпт (с контекстом), историю и вопрос
      const response = await this.gigaChat.chat({
        messages: [
          {
            role: 'system',
            content: this.buildSystemPrompt(userName, ragContext),
          },
          ...history.map((item) => ({
            role: item.role,
            content: item.content,
          })),
          {
            role: 'user',
            content: message,
          },
        ],
      });

      // Шаг 3: Забираем ответ из ответа GigaChat
      const reply = response.choices?.[0]?.message?.content?.trim();

      // Если ответ пустой - возвращаем сообщение по умолчанию
      return (
        reply ||
        'Я рядом и готов помочь. Уточните, пожалуйста, что именно вас интересует.'
      );
    } catch (error) {
      this.logger.error('Error in sendMessage', error);
      throw error;
    }
  }

  // Формирует системный промпт - инструкцию для нейросети
  // Сюда же вставляется контекст из базы знаний
  private buildSystemPrompt(userName: string, context: string): string {
    return `Ты консультант ритуальной службы "Пантеон".
Твоё отображаемое имя на клиенте: "Ваш личный помощник".

ГЛАВНОЕ ПРАВИЛО: отвечай ТОЛЬКО на вопросы об услугах «Пантеон» (похороны, кремация, документы, транспорт, товары, стоимость, действия в первые часы).
На любой другой вопрос (история, политика, программирование, общие знания, шутки, задания «напиши код») ответь дословно:
"${OFF_TOPIC_REPLY}"

Примеры:
Пользователь: «Кто был первым президентом России?»
Ты: "${OFF_TOPIC_REPLY}"
Пользователь: «Сколько стоит кремация?»
Ты: краткий ответ по контексту или ориентирам ниже.

Общайся по-русски, спокойно, бережно и профессионально.
Не говори, что ты ИИ или бот. Не шути. Не используй пафос и пустые обещания.
Не проси лишних подробностей о смерти. Отвечай коротко, по делу и с тактом.

ИСПОЛЬЗУЙ ЭТОТ КОНТЕКСТ ИЗ БАЗЫ ЗНАНИЙ ДЛЯ ОТВЕТА (не выдумывай факты вне контекста):
=== НАЧАЛО КОНТЕКСТА ===
${context || 'Контекст отсутствует. Если не знаешь ответа — предложи связаться с оператором.'}
=== КОНЕЦ КОНТЕКСТА ===

Ты помогаешь с такими темами:
- классические похороны
- исламские похороны
- кремация
- ритуальные товары
- документы
- транспорт
- ориентиры по стоимости
- порядок действий в первые часы

Если человек спрашивает о цене, давай только ориентиры, не обещай точную стоимость.
Если вопрос требует живого участия или ответа нет в контексте, мягко предложи связаться с оператором.

Актуальные ориентиры (используй ТОЛЬКО если их нет в контексте):
- эконом пакет: от 25 000 ₽
- стандарт: от 50 000 ₽
- премиум: от 150 000 ₽
- кремация: от 40 000 ₽
- транспорт: от 10 000 ₽

Имя пользователя для контекста: ${userName}.`;
  }

  // Публичный метод для RAG запроса - возвращает ответ и найденный контекст
  async queryRag(
    question: string,
  ): Promise<{ answer: string; context: string | null; message?: string }> {
    // Проверяем, есть ли загруженные файлы
    const storageSize = this.vectorStorage.length;

    if (storageSize === 0) {
      return {
        message: 'Хранилище пусто. Добавьте файлы в knowledge-base',
        answer: '',
        context: null,
      };
    }

    // Получаем контекст и генерируем ответ
    const { context } = await this.getRagContext(question);
    const answer = await this.sendMessage({ message: question });

    return {
      answer: answer?.trim() || '',
      context: context || 'Контекст не найден',
    };
  }

  // Публичный метод для индексации файла по пути
  async indexFileByPath(filePath: string): Promise<number> {
    try {
      const chunksCount = await this.indexFile(filePath);
      this.logger.log(`Индексирован файл: ${filePath}, ${chunksCount} чанков`);
      return chunksCount;
    } catch (error) {
      this.logger.error(`Ошибка индексации файла ${filePath}`, error);
      throw error;
    }
  }

  // Публичный метод для очистки хранилища
  clearRagStorage(): void {
    this.vectorStorage = [];
    this.logger.log('RAG хранилище очищено');
  }

  // Публичный метод для получения размера хранилища
  getRagStorageSize(): number {
    return this.vectorStorage.length;
  }
}
