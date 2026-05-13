import { Test, TestingModule } from '@nestjs/testing';
import { ClassicServiceController } from './classic-service.controller';

describe('ClassicServiceController', () => {
  let controller: ClassicServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassicServiceController],
    }).compile();

    controller = module.get<ClassicServiceController>(ClassicServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
