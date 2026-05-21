import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { Order } from './order.model';
import { Card } from '../card/card.model';
import { ADMIN_USER_ID } from '../common/constants/admin';

describe('OrdersService', () => {
  let service: OrdersService;

  const orderModel = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  const cardModel = {
    findAll: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getModelToken(Order), useValue: orderModel },
        { provide: getModelToken(Card), useValue: cardModel },
      ],
    }).compile();

    service = module.get(OrdersService);
    jest.clearAllMocks();
  });

  describe('createFromCart', () => {
    it('throws when cart is empty', async () => {
      cardModel.findAll.mockResolvedValue([]);

      await expect(service.createFromCart(2)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.createFromCart(2)).rejects.toThrow('Корзина пуста');
    });

    it('throws when cart has no valid line items', async () => {
      cardModel.findAll.mockResolvedValue([{ id: 1, service: null }]);

      await expect(service.createFromCart(2)).rejects.toThrow(
        'В корзине нет позиций для заказа',
      );
    });

    it('creates paid order and clears cart for card payment', async () => {
      cardModel.findAll.mockResolvedValue([
        {
          id: 1,
          service: { name: 'Венок', price: 5000, category: 'shop' },
        },
      ]);
      orderModel.create.mockResolvedValue({ id: 10 });
      cardModel.destroy.mockResolvedValue(1);

      const result = await service.createFromCart(2, 'card');

      expect(orderModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 2,
          total: 5000,
          paymentMethod: 'card',
          status: 'paid',
          items: [{ name: 'Венок', price: 5000, category: 'shop' }],
        }),
      );
      expect(cardModel.destroy).toHaveBeenCalledWith({ where: { userId: 2 } });
      expect(result).toMatchObject({
        success: true,
        total: 5000,
        items: 1,
        orderId: 10,
        message: 'Оплата прошла успешно',
      });
    });

    it('creates awaiting_cash order for cash payment', async () => {
      cardModel.findAll.mockResolvedValue([
        {
          id: 2,
          cremation: { name: 'Кремация', price: 12000, category: null },
        },
      ]);
      orderModel.create.mockResolvedValue({ id: 11 });

      const result = await service.createFromCart(3, 'cash');

      expect(orderModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'awaiting_cash',
          paymentMethod: 'cash',
        }),
      );
      expect(result.message).toBe('Заказ оформлен, оплата при встрече');
    });
  });

  describe('findAllForAdmin', () => {
    it('loads orders excluding admin user', async () => {
      const orders = [{ id: 1, userId: 2 }];
      orderModel.findAll.mockResolvedValue(orders);

      const result = await service.findAllForAdmin();

      expect(orderModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: { [Op.ne]: ADMIN_USER_ID } },
        }),
      );
      expect(result).toEqual(orders);
    });
  });
});
