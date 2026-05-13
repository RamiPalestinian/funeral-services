import { Test, TestingModule } from '@nestjs/testing';
import { CremationsService } from './cremations.service';

describe('CremationsService', () => {
  let service: CremationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CremationsService],
    }).compile();

    service = module.get<CremationsService>(CremationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
