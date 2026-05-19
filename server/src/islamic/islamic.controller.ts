import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { IslamicService } from './islamic.service';
import { CreateIslamicDto } from './dto/create-islamic.dto';
import { UpdateIslamicDto } from './dto/update-islamic.dto';

@Controller('islamic')
export class IslamicController {
  constructor(private readonly islamicService: IslamicService) {}

  @Get()
  findAll() {
    return this.islamicService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.islamicService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateIslamicDto) {
    return this.islamicService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateIslamicDto) {
    return this.islamicService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.islamicService.delete(id);
  }
}
