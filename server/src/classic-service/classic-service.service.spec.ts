import { Test, TestingModule } from '@nestjs/testing';
import { ClassicServiceService } from './classic-service.service';

describe('ClassicServiceService', () => {
  let service: ClassicServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassicServiceService],
    }).compile();

    service = module.get<ClassicServiceService>(ClassicServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
