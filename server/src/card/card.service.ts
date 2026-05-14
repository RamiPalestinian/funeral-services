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

    const created = await this.cardModel.create({
      userId: dto.userId,
      serviceId: dto.serviceId ?? null,
      islamicId: dto.islamicId ?? null,
      classicServiceId: dto.classicServiceId ?? null,
      cremationId: dto.cremationId ?? null,
    } as CreationAttributes<Card>);

    return created.reload({ include: this.cardWithRelationsInclude() });
  }

  async findAll() {
    return this.cardModel.findAll({
      include: this.cardWithRelationsInclude(),
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: number) {
    const card = await this.cardModel.findByPk(id, {
      include: this.cardWithRelationsInclude(),
    });
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
