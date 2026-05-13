import { Test, TestingModule } from '@nestjs/testing';
import { CremationsController } from './cremations.controller';

describe('CremationsController', () => {
  let controller: CremationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CremationsController],
    }).compile();

    controller = module.get<CremationsController>(CremationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
