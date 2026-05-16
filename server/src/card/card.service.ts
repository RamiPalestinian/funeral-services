import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Card } from './card.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCardDto } from './dto/create-card.dto';
import { CreationAttributes, Includeable } from 'sequelize';
import { Service } from 'src/services/services.model';
import { User } from 'src/users/user.model';
import { Islamic } from 'src/islamic/islamic.model';
import { ClassicService } from 'src/classic-service/classicService.model';
import { Cremation } from 'src/cremations/cremations.model';

const catalogAttributes = [
  'id',
  'name',
  'description',
  'price',
  'category',
  'image',
  'status',
] as const;

@Injectable()
export class CardService {
  constructor(@InjectModel(Card) private readonly cardModel: typeof Card) {}

  private cardWithRelationsInclude(): Includeable[] {
    return [
      {
        model: User,
        required: false,
        attributes: ['id', 'name', 'email'],
      },
      {
        model: Service,
        required: false,
        attributes: [...catalogAttributes],
      },
      {
        model: Islamic,
        required: false,
        attributes: [...catalogAttributes],
      },
      {
        model: ClassicService,
        required: false,
        attributes: [...catalogAttributes],
      },
      {
        model: Cremation,
        required: false,
        attributes: [...catalogAttributes],
      },
    ];
  }

  async create(dto: CreateCardDto, userId: number) {
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

    const created = await this.cardModel.create({
      userId,
      serviceId: dto.serviceId ?? null,
      islamicId: dto.islamicId ?? null,
      classicServiceId: dto.classicServiceId ?? null,
      cremationId: dto.cremationId ?? null,
    } as CreationAttributes<Card>);

    return created.reload({ include: this.cardWithRelationsInclude() });
  }

  async findAllForUser(userId: number) {
    return this.cardModel.findAll({
      where: { userId },
      include: this.cardWithRelationsInclude(),
      order: [['createdAt', 'DESC']],
    });
  }

  async findByIdForUser(id: number, userId: number) {
    const card = await this.cardModel.findOne({
      where: { id, userId },
      include: this.cardWithRelationsInclude(),
    });
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    return card;
  }

  async deleteForUser(id: number, userId: number) {
    const result = await this.cardModel.destroy({ where: { id, userId } });
    if (result === 0) {
      throw new NotFoundException('Card not found');
    }
    return result;
  }

  async clearCartForUser(userId: number) {
    const cards = await this.findAllForUser(userId);

    if (cards.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    let total = 0;
    for (const card of cards) {
      const price =
        card.service?.price ??
        card.islamic?.price ??
        card.classicService?.price ??
        card.cremation?.price ??
        0;

      total += Number(price);
    }

    await this.cardModel.destroy({ where: { userId } });

    return {
      success: true,
      message: 'Тестовая оплата прошла успешно',
      total,
      items: cards.length,
    };
  }
}
