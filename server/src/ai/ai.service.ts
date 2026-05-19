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

  // Находит topP самых похожих фрагментов из хранилища
  private async findRelevantChunks(query: string): Promise<string[]> {
    // Если хранилище пусто - возвращаем пустой массив
    if (this.vectorStorage.length === 0) {
      this.logger.warn('Векторное хранилище пусто');
      return [];
    }

    // Получаем все тексты из хранилища
    const textFragments = this.vectorStorage.map((item) => item.text);
    // Получаем оценки похожести для каждого фрагмента
    const similarity = await this.getSimilarity(query, textFragments);

    // Сортируем фрагменты по похожести (от большего к меньшему)
    // и берем только topP самых похожих
    const rankedSimilarity = similarity
      .map((score, index) => ({
        text: textFragments[index],
        score,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, this.topP);

    // Возвращаем только тексты, без оценок
    return rankedSimilarity.map((item) => item.text);
  }

  // Получает контекст из базы знаний для вопроса пользователя
  private async getRagContext(query: string): Promise<string> {
    // Ищем похожие фрагменты
    const relevantChunks = await this.findRelevantChunks(query);

    // Если ничего не нашли - возвращаем пустую строку
    if (relevantChunks.length === 0) {
      return '';
    }

    // Объединяем найденные фрагменты через разделитель
    return relevantChunks.join('\n---\n');
  }

  // Главный метод - отправляет сообщение в GigaChat с контекстом из RAG
  async sendMessage({
    message,
    userName = 'посетитель',
    history = [],
  }: SendMessageDto): Promise<string> {
    try {
      // Шаг 1: Ищем релевантные фрагменты в базе знаний
      const ragContext = await this.getRagContext(message);

      // Логируем результат поиска
      if (ragContext) {
        this.logger.log(`Найден RAG контекст: ${ragContext.length} символов`);
      } else {
        this.logger.log('RAG контекст не найден');
      }

      // Шаг 2: Отправляем запрос в GigaChat
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

Общайся по-русски, спокойно, бережно и профессионально.
Не говори, что ты ИИ или бот.
Не шути.
Не используй пафос и пустые обещания.
Не проси лишних подробностей о смерти.
Отвечай коротко, по делу и с человеческим тактом.

ИСПОЛЬЗУЙ ЭТОТ КОНТЕКСТ ИЗ БАЗЫ ЗНАНИЙ ДЛЯ ОТВЕТА:
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
    const context = await this.getRagContext(question);
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
