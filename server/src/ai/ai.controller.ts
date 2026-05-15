import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { AiService } from './ai.service';

class GetAiResponseDto {
  title: string;
  text: string;
  style?: string;
}

@Controller('ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);

  constructor(private readonly aiService: AiService) {}

  @Post('response')
  @HttpCode(HttpStatus.OK)
  async getAiResponse(@Body() dto: GetAiResponseDto) {
    const { title, text, style } = dto;

    // Проверка на наличие обязательных полей
    if (!title || !text) {
      throw new BadRequestException('Заголовок и текст обязательны');
    }

    // Проверка на длину полей
    if (text.length > 500 || title.length > 100) {
      throw new BadRequestException(
        'Заголовок и текст не должны превышать 100 и 500 символов соответственно'
      );
    }

    try {
      const result = await this.aiService.generateText({ title, text, style });

      if (!result) {
        throw new InternalServerErrorException('Ошибка при генерации текста');
      }

      return {
        statusCode: 200,
        message: 'Ответ получен',
        data: result,
        error: null,
      };
    } catch (error) {
      this.logger.error('==== AiController.getAiResponse ====');
      this.logger.error(error);

      if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException('Внутренняя ошибка сервера');
    }
  }
}