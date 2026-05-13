import { Injectable, NotFoundException } from '@nestjs/common';
import { Service } from './services.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateServicesDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import type { CreationAttributes } from 'sequelize';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service) private readonly serviceModel: typeof Service,
  ) {}

  async findAll() {
    return this.serviceModel.findAll();
  }

  async findById(id: number) {
    const service = await this.serviceModel.findByPk(id);
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async create(dto: CreateServicesDto) {
    return this.serviceModel.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      image: dto.image,
      category: dto.category,
      status: dto.status,
      userId: dto.userId,
    } as CreationAttributes<Service>);
  }

  async update(id: number, dto: UpdateServiceDto) {
    const [updatedRows] = await this.serviceModel.update(dto, {
      where: { id },
    });
    if (updatedRows === 0) {
      throw new NotFoundException('Service not found');
    }
    return this.findById(id);
  }

  async delete(id: number) {
    return this.serviceModel.destroy({ where: { id } });
  }
}
