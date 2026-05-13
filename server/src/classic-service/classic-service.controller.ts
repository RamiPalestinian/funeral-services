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
import { ClassicServiceService } from './classic-service.service';
import { CreateClassicServicesDto } from './dto/create-classicService.dto';
import { UpdateClassicServiceDto } from './dto/update-classicService.dto';

@Controller('classic')
export class ClassicServiceController {
  constructor(private readonly classicServiceService: ClassicServiceService) {}

  @Get()
  findAll() {
    return this.classicServiceService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.classicServiceService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateClassicServicesDto) {
    return this.classicServiceService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClassicServiceDto,
  ) {
    return this.classicServiceService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.classicServiceService.delete(id);
  }
}
