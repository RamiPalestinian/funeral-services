import { Injectable, NotFoundException } from '@nestjs/common';
import { Cremation } from './cremations.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCremationDto } from './dto/create-cremation.dto';
import { UpdateCremationDto } from './dto/update-cremation.dto';
import type { CreationAttributes } from 'sequelize';

@Injectable()
export class CremationsService {
  constructor(
    @InjectModel(Cremation) private readonly cremationModel: typeof Cremation,
  ) {}

  async findAll() {
    return this.cremationModel.findAll();
  }

  async findById(id: number) {
    const cremation = await this.cremationModel.findByPk(id);
    if (!cremation) {
      throw new NotFoundException('Cremation not found');
    }
    return cremation;
  }

  async create(dto: CreateCremationDto) {
    return this.cremationModel.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      image: dto.image,
      category: dto.category,
      userId: dto.userId,
    } as CreationAttributes<Cremation>);
  }

  async update(id: number, dto: UpdateCremationDto) {
    const [updatedRows] = await this.cremationModel.update(dto, {
      where: { id },
    });
    if (updatedRows === 0) {
      throw new NotFoundException('Cremation not found');
    }
    return this.findById(id);
  }

  async delete(id: number) {
    const result = await this.cremationModel.destroy({
      where: { id },
    });
    if (result === 0) {
      throw new NotFoundException('Cremation not found');
    }
    return result;
  }
}
