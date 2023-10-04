import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from './bcrypt.service';

describe('BcryptService', () => {
  let service: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();

    service = module.get<BcryptService>(BcryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('hash strings', async () => {
    const message = 'test message';
    const hashedMessage = await service.hash(message);
    expect(hashedMessage).not.toBe(message);
  });

  it('compares strings', async () => {
    const message = 'test message';
    const hashedMessage = await service.hash(message);
    const isEqual = await service.compare(message, hashedMessage);
    expect(isEqual).toBe(true);
  });
});
