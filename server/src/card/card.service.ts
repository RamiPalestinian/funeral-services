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
import { OrdersService } from 'src/orders/orders.service';

const catalogAttributes = [
  'id',
  'name',
  'description',
  'price',
  'category',
  'image',
] as const;

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card) private readonly cardModel: typeof Card,
    private readonly ordersService: OrdersService,
  ) {}

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
      throw new NotFoundException('Карта не найдена');
    }
    return card;
  }

  async deleteForUser(id: number, userId: number) {
    const result = await this.cardModel.destroy({ where: { id, userId } });
    if (result === 0) {
      throw new NotFoundException('Карта не найдена');
    }
    return result;
  }

  async mockCheckoutForUser(
    userId: number,
    paymentMethod: 'card' | 'sbp' | 'cash' = 'card',
  ) {
    return this.ordersService.createFromCart(userId, paymentMethod);
  }
}
