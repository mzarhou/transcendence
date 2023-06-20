import { Test, TestingModule } from '@nestjs/testing';
import { School42AuthService } from './school42-auth.service';

describe('School42AuthService', () => {
  let service: School42AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [School42AuthService],
    }).compile();

    service = module.get<School42AuthService>(School42AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
