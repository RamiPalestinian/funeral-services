import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AiService } from './ai.service';
import { IndexFileDto } from './dto/index-file.dto';
import { QueryDto } from './dto/query.dto';
import { SendMessageDto } from './dto/send-message.dto';

type SendMessageResponse = {
  success: true;
  answer: string;
};

type RagQueryResponse = {
  success: true;
  answer: string;
  context: string | null;
  message?: string;
};

type IndexFileResponse = {
  success: true;
  chunksCount: number;
  filePath: string;
};

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('send-message')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async sendMessage(@Body() dto: SendMessageDto): Promise<SendMessageResponse> {
    const answer = await this.aiService.sendMessage({
      message: dto.message.trim(),
      userName: dto.userName,
      history: dto.history ?? [],
    });

    return { success: true, answer };
  }

  @Post('index-file')
  @HttpCode(HttpStatus.OK)
  async indexFile(@Body() dto: IndexFileDto): Promise<IndexFileResponse> {
    const filePath = dto.filePath.trim();
    const chunksCount = await this.aiService.indexFileByPath(filePath);

    return { success: true, chunksCount, filePath };
  }

  @Post('query')
  @HttpCode(HttpStatus.OK)
  async query(@Body() dto: QueryDto): Promise<RagQueryResponse> {
    const { answer, context, message } = await this.aiService.queryRag(
      dto.question.trim(),
    );

    return {
      success: true,
      answer,
      context,
      ...(message !== undefined ? { message } : {}),
    };
  }

  @Post('clear-storage')
  @HttpCode(HttpStatus.OK)
  clearStorage(): { success: true; message: string } {
    this.aiService.clearRagStorage();
    return { success: true, message: 'Хранилище очищено' };
  }

  @Post('storage-info')
  @HttpCode(HttpStatus.OK)
  getStorageInfo(): { success: true; storageSize: number } {
    return {
      success: true,
      storageSize: this.aiService.getRagStorageSize(),
    };
  }
}
