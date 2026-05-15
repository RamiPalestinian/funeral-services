import { Injectable, Logger } from '@nestjs/common';
import { GigaChatService } from '../gigachat/gigachat.service'; // если используете GigaChat

interface GenerateTextDto {
  title: string;
  text: string;
  style?: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly gigaChatService: GigaChatService) {}

  async generateText({ title, text, style }: GenerateTextDto): Promise<string | null> {
    try {
      const prompt = this.buildPrompt(title, text, style);
      const response = await this.gigaChatService.sendMessage(prompt);
      return response;
    } catch (error) {
      this.logger.error('Error in generateText:', error);
      return null;
    }
  }

  private buildPrompt(title: string, text: string, style?: string): string {
    let prompt = `Проанализируй следующий сон и дай интерпретацию.\n\n`;
    prompt += `Название сна: ${title}\n`;
    prompt += `Описание сна: ${text}\n`;
    
    if (style) {
      prompt += `Стиль интерпретации: ${style}\n`;
    }
    
    prompt += `\nДай подробное, глубокое и полезное толкование этого сна.`;
    
    return prompt;
  }
}