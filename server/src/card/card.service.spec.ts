import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';
import { Card } from './card.model';
import { OrdersService } from '../orders/orders.service';

describe('CardService', () => {
  let service: CardService;

  const cardModel = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
  };

  const ordersService = {
    createFromCart: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardService,
        { provide: getModelToken(Card), useValue: cardModel },
        { provide: OrdersService, useValue: ordersService },
      ],
    }).compile();

    service = module.get(CardService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('rejects when no catalog item is specified', async () => {
      await expect(service.create({}, 1)).rejects.toThrow(BadRequestException);
    });

    it('rejects when multiple catalog items are specified', async () => {
      await expect(
        service.create({ serviceId: 1, islamicId: 2 }, 1),
      ).rejects.toThrow(BadRequestException);
    });

    it('creates card with exactly one service reference', async () => {
      const reloaded = { id: 5, serviceId: 1 };
      const created = { reload: jest.fn().mockResolvedValue(reloaded) };
      cardModel.create.mockResolvedValue(created);

      const result = await service.create({ serviceId: 1 }, 2);

      expect(cardModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 2,
          serviceId: 1,
          islamicId: null,
        }),
      );
      expect(created.reload).toHaveBeenCalled();
      expect(result).toEqual(reloaded);
    });
  });

  describe('findByIdForUser', () => {
    it('throws when card is missing', async () => {
      cardModel.findOne.mockResolvedValue(null);

      await expect(service.findByIdForUser(9, 2)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteForUser', () => {
    it('throws when nothing was deleted', async () => {
      cardModel.destroy.mockResolvedValue(0);

      await expect(service.deleteForUser(9, 2)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('mockCheckoutForUser', () => {
    it('delegates checkout to OrdersService', async () => {
      const checkoutResult = { success: true, total: 100, items: 1 };
      ordersService.createFromCart.mockResolvedValue(checkoutResult);

      const result = await service.mockCheckoutForUser(2, 'sbp');

      expect(ordersService.createFromCart).toHaveBeenCalledWith(2, 'sbp');
      expect(result).toEqual(checkoutResult);
    });
  });
});
