import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';
import { AiService } from './ai.service';

type ChatHistoryMessageDto = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatRequestDto = {
  message: string;
  userName?: string;
  history?: ChatHistoryMessageDto[];
};

@Controller('ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);

  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  async chat(@Body() dto: ChatRequestDto) {
    const message = dto.message?.trim();

    if (!message) {
      throw new BadRequestException('Сообщение обязательно');
    }

    if (message.length > 1000) {
      throw new BadRequestException(
        'Сообщение не должно превышать 1000 символов',
      );
    }

    try {
      const reply = await this.aiService.sendMessage({
        message,
        userName: dto.userName,
        history: dto.history ?? [],
      });

      return {
        statusCode: 200,
        message: 'Ответ получен',
        data: {
          reply,
          assistantName: 'Ваш личный помощник',
        },
        error: null,
      };
    } catch (error) {
      this.logger.error('==== AiController.chat ====');
      this.logger.error(error);
      throw new InternalServerErrorException('Не удалось получить ответ');
    }
  }
}
