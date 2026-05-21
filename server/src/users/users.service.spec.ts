import { getModelToken } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.model';
import { Card } from '../card/card.model';
import { Service } from '../services/services.model';
import { Islamic } from '../islamic/islamic.model';
import { ClassicService } from '../classic-service/classicService.model';
import { Cremation } from '../cremations/cremations.model';
import { ADMIN_USER_ID } from '../common/constants/admin';

describe('UsersService', () => {
  let service: UsersService;

  const userModel = { findAll: jest.fn() };
  const cardModel = {};
  const serviceModel = {};
  const islamicModel = {};
  const classicServiceModel = {};
  const cremationModel = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User), useValue: userModel },
        { provide: getModelToken(Card), useValue: cardModel },
        { provide: getModelToken(Service), useValue: serviceModel },
        { provide: getModelToken(Islamic), useValue: islamicModel },
        { provide: getModelToken(ClassicService), useValue: classicServiceModel },
        { provide: getModelToken(Cremation), useValue: cremationModel },
      ],
    }).compile();

    service = module.get(UsersService);
    jest.clearAllMocks();
  });

  describe('findAllWithCartsForAdmin', () => {
    it('returns public users with mapped cart lines', async () => {
      const createdAt = new Date('2026-01-15');
      userModel.findAll.mockResolvedValue([
        {
          id: 2,
          name: 'Иван',
          email: 'ivan@test.ru',
          password: 'hash',
          lastName: 'Петров',
          middleName: null,
          phone: '+7999',
          address: null,
          city: 'Москва',
          avatar: null,
          createdAt,
          updatedAt: createdAt,
          cards: [
            {
              id: 7,
              service: { name: 'Венок', price: '3000', category: 'shop' },
            },
            { id: 8, service: null, islamic: null },
          ],
        },
      ]);

      const result = await service.findAllWithCartsForAdmin();

      expect(userModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: { [Op.ne]: ADMIN_USER_ID } },
        }),
      );
      expect(result).toHaveLength(1);
      expect(result[0].user).toMatchObject({
        id: 2,
        name: 'Иван',
        email: 'ivan@test.ru',
        city: 'Москва',
      });
      expect(result[0].user).not.toHaveProperty('password');
      expect(result[0].cart).toEqual([
        {
          cardId: 7,
          name: 'Венок',
          price: 3000,
          category: 'shop',
        },
      ]);
    });
  });
});
