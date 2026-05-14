import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

describe('CardController', () => {
  let controller: CardController;

  const cardServiceMock = {
    create: jest.fn(),
    findAllForUser: jest.fn(),
    findByIdForUser: jest.fn(),
    deleteForUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
      providers: [{ provide: CardService, useValue: cardServiceMock }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CardController>(CardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
