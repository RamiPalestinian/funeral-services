import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';

type JwtRequestUser = { userId: number; email: string };

@Controller('card')
@UseGuards(JwtAuthGuard)
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateCardDto,
    @Req() req: Request & { user: JwtRequestUser },
  ) {
    return this.cardService.create(dto, req.user.userId);
  }

  @Get()
  findAll(@Req() req: Request & { user: JwtRequestUser }) {
    return this.cardService.findAllForUser(req.user.userId);
  }

  @Get(':id')
  findById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: JwtRequestUser },
  ) {
    return this.cardService.findByIdForUser(id, req.user.userId);
  }

  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: JwtRequestUser },
  ) {
    return this.cardService.deleteForUser(id, req.user.userId);
  }

  @Post('mock-checkout')
  @HttpCode(HttpStatus.OK)
  mockCheckout(@Req() req: Request & { user: JwtRequestUser }) {
    return this.cardService.mockCheckoutForUser(req.user.userId);
  }
}
