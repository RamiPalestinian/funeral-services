import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Islamic } from './islamic.model';
import { CreateIslamicDto } from './dto/create-islamic.dto';
import { UpdateIslamicDto } from './dto/update-islamic.dto';

import type { CreationAttributes } from 'sequelize';

@Injectable()
export class IslamicService {
  constructor(
    @InjectModel(Islamic) private readonly islamicModel: typeof Islamic,
  ) {}

  async findAll() {
    return this.islamicModel.findAll();
  }

  async findById(id: number) {
    const islamic = await this.islamicModel.findByPk(id);

    if (!islamic) {
      throw new NotFoundException('Islamic not found');
    }

    return islamic;
  }

  async create(dto: CreateIslamicDto) {
    return this.islamicModel.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      image: dto.image,
      category: dto.category,
      status: dto.status,
      userId: dto.userId,
    } as CreationAttributes<Islamic>);
  }

  async delete(id: number) {
    const result = await this.islamicModel.destroy({ where: { id } });

    if (result === 0) {
      throw new NotFoundException('Islamic not found');
    }

    return true;
  }

  async update(id: number, dto: UpdateIslamicDto) {
    const [updatedRows] = await this.islamicModel.update(dto, {
      where: { id },
    });

    if (updatedRows === 0) {
      throw new NotFoundException('Islamic not found');
    }

    const updatedIslamic = await this.findById(id);

    return updatedIslamic;
  }
}
