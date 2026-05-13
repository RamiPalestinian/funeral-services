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
import { ServicesService } from './services.service';
import { CreateServicesDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('shops')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

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
  create(@Body() dto: CreateServicesDto) {
    return this.servicesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.servicesService.delete(id);
  }
}
