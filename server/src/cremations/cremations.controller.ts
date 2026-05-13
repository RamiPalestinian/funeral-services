import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CremationsService } from './cremations.service';
import { CreateCremationDto } from './dto/create-cremation.dto';
import { UpdateCremationDto } from './dto/update-cremation.dto';

@Controller('cremations')
export class CremationsController {
  constructor(private readonly cremationsService: CremationsService) {}

  @Get()
  findAll() {
    return this.cremationsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.cremationsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCremationDto) {
    return this.cremationsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCremationDto) {
    return this.cremationsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.cremationsService.delete(id);
  }
}
