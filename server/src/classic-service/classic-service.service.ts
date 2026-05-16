import { Injectable, NotFoundException } from '@nestjs/common';
import { ClassicService } from './classicService.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateClassicServicesDto } from './dto/create-classicService.dto';
import { UpdateClassicServiceDto } from './dto/update-classicService.dto';
import type { CreationAttributes } from 'sequelize';

@Injectable()
export class ClassicServiceService {
  constructor(
    @InjectModel(ClassicService)
    private readonly serviceModel: typeof ClassicService,
  ) {}

  async findAll() {
    return this.serviceModel.findAll();
  }

  async findById(id: number) {
    const classicService = await this.serviceModel.findByPk(id);
    if (!classicService) {
      throw new NotFoundException('classicService not found');
    }
    return classicService;
  }

  async create(dto: CreateClassicServicesDto) {
    return this.serviceModel.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      image: dto.image,
      category: dto.category,
      userId: dto.userId,
    } as CreationAttributes<ClassicService>);
  }

  async update(id: number, dto: UpdateClassicServiceDto) {
    const [updatedRows] = await this.serviceModel.update(dto, {
      where: { id },
    });
    if (updatedRows === 0) {
      throw new NotFoundException('ClassicService not found');
    }
    return this.findById(id);
  }

  async delete(id: number) {
    const result = await this.serviceModel.destroy({
      where: { id },
    });
    if (result === 0) {
      throw new NotFoundException('ClassicService not found');
    }
    return result;
  }
}
