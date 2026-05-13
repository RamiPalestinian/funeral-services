import { Test, TestingModule } from '@nestjs/testing';
import { IslamicService } from './islamic.service';

describe('IslamicService', () => {
  let service: IslamicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IslamicService],
    }).compile();

    service = module.get<IslamicService>(IslamicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
