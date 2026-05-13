import { Test, TestingModule } from '@nestjs/testing';
import { IslamicController } from './islamic.controller';

describe('IslamicController', () => {
  let controller: IslamicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IslamicController],
    }).compile();

    controller = module.get<IslamicController>(IslamicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
