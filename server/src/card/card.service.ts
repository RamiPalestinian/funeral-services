import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Card } from './card.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class CardService {
  constructor(@InjectModel(Card) private readonly cardModel: typeof Card) {}

  async create(dto: CreateCardDto) {
    const refs = [
      dto.serviceId,
      dto.islamicId,
      dto.classicServiceId,
      dto.cremationId,
    ].filter((v) => v != null);

    if (refs.length !== 1) {
      throw new BadRequestException(
        'Нужно указать ровно одну позицию: товар, кремацию, исламскую или классическую услугу',
      );
    }

    return this.cardModel.create({
      userId: dto.userId,
      serviceId: dto.serviceId ?? null,
      islamicId: dto.islamicId ?? null,
      classicServiceId: dto.classicServiceId ?? null,
      cremationId: dto.cremationId ?? null,
    });
  }

  async findAll() {
    return this.cardModel.findAll();
  }

  async findById(id: number) {
    const card = await this.cardModel.findByPk(id);
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    return card;
  }

  async delete(id: number) {
    const result = await this.cardModel.destroy({ where: { id } });
    if (result === 0) {
      throw new NotFoundException('Card not found');
    }
    return result;
  }
}
