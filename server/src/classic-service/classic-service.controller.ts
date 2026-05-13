import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClassicServiceService } from './classic-service.service';
import { CreateClassicServicesDto } from './dto/create-classicService.dto';
import { UpdateClassicServiceDto } from './dto/update-classicService.dto';

@Controller('classic-service')
export class ClassicServiceController {
  constructor(private readonly servicesService: ClassicServiceService) {}

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.servicesService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateClassicServicesDto) {
    return this.servicesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateClassicServiceDto) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.servicesService.delete(id);
  }
}
