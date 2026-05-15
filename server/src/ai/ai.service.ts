import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Agent } from 'node:https';
import GigaChat from 'gigachat';

type ChatHistoryMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type SendMessageDto = {
  message: string;
  userName?: string;
  history?: ChatHistoryMessage[];
};

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly gigaChat: GigaChat;

  constructor(private readonly configService: ConfigService) {
    const httpsAgent = new Agent({
      rejectUnauthorized: false,
    });

    this.gigaChat = new GigaChat({
      model: 'GigaChat',
      credentials: this.configService.get<string>('GIGACHAT_API_KEY'),
      httpsAgent,
    });
  }

  async sendMessage({
    message,
    userName = 'посетитель',
    history = [],
  }: SendMessageDto): Promise<string> {
    try {
      const response = await this.gigaChat.chat({
        messages: [
          {
            role: 'system',
            content: this.buildSystemPrompt(userName),
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

      const reply = response.choices?.[0]?.message?.content?.trim();

      return (
        reply ||
        'Я рядом и готов помочь. Уточните, пожалуйста, что именно вас интересует.'
      );
    } catch (error) {
      this.logger.error('Error in sendMessage', error);
      throw error;
    }
  }

  private buildSystemPrompt(userName: string): string {
    return `Ты консультант ритуальной службы "Груз 200".
Твоё отображаемое имя на клиенте: "Ваш личный помощник".

Общайся по-русски, спокойно, бережно и профессионально.
Не говори, что ты ИИ или бот.
Не шути.
Не используй пафос и пустые обещания.
Не проси лишних подробностей о смерти.
Отвечай коротко, по делу и с человеческим тактом.

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
Если вопрос требует живого участия, мягко предложи связаться с оператором.

Актуальные ориентиры:
- эконом пакет: от 25 000 ₽
- стандарт: от 50 000 ₽
- премиум: от 150 000 ₽
- кремация: от 40 000 ₽
- транспорт: от 10 000 ₽

Если пользователь только начинает диалог, можно говорить так же естественно, как личный помощник службы поддержки.
Имя пользователя для контекста: ${userName}.`;
  }
}
