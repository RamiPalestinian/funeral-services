import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes, Includeable, Op } from 'sequelize';
import { Card } from '../card/card.model';
import { ClassicService } from '../classic-service/classicService.model';
import { Cremation } from '../cremations/cremations.model';
import { Islamic } from '../islamic/islamic.model';
import { Service } from '../services/services.model';
import { ADMIN_USER_ID } from '../common/constants/admin';
import { Order, OrderLineItem } from './order.model';
import { User } from '../users/user.model';

const catalogAttributes = [
  'id',
  'name',
  'description',
  'price',
  'category',
  'image',
] as const;

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order) private readonly orderModel: typeof Order,
    @InjectModel(Card) private readonly cardModel: typeof Card,
  ) {}

  private cardInclude(): Includeable[] {
    return [
      { model: Service, required: false, attributes: [...catalogAttributes] },
      { model: Islamic, required: false, attributes: [...catalogAttributes] },
      {
        model: ClassicService,
        required: false,
        attributes: [...catalogAttributes],
      },
      { model: Cremation, required: false, attributes: [...catalogAttributes] },
    ];
  }

  private lineItemFromCard(card: Card): OrderLineItem | null {
    const item =
      card.service ?? card.islamic ?? card.classicService ?? card.cremation;

    if (!item) {
      return null;
    }

    return {
      name: item.name,
      price: Number(item.price),
      category: item.category ?? null,
    };
  }

  async createFromCart(
    userId: number,
    paymentMethod: 'card' | 'sbp' | 'cash' = 'card',
  ) {
    const cards = await this.cardModel.findAll({
      where: { userId },
      include: this.cardInclude(),
      order: [['createdAt', 'DESC']],
    });

    if (cards.length === 0) {
      throw new NotFoundException('Корзина пуста');
    }

    const items: OrderLineItem[] = [];
    let total = 0;

    for (const card of cards) {
      const line = this.lineItemFromCard(card);
      if (!line) continue;
      items.push(line);
      total += line.price;
    }

    if (items.length === 0) {
      throw new NotFoundException('В корзине нет позиций для заказа');
    }

    const status = paymentMethod === 'cash' ? 'awaiting_cash' : 'paid';

    const order = await this.orderModel.create({
      userId,
      total,
      paymentMethod,
      status,
      items,
    } as CreationAttributes<Order>);

    await this.cardModel.destroy({ where: { userId } });

    return {
      success: true,
      message:
        paymentMethod === 'cash'
          ? 'Заказ оформлен, оплата при встрече'
          : 'Оплата прошла успешно',
      total,
      items: items.length,
      orderId: order.id,
    };
  }

  async findAllForAdmin() {
    return this.orderModel.findAll({
      where: { userId: { [Op.ne]: ADMIN_USER_ID } },
      include: [
        {
          model: User,
          attributes: [
            'id',
            'name',
            'lastName',
            'middleName',
            'phone',
            'city',
            'email',
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }
}
