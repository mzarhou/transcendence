import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';
import { ConfigModule } from '@nestjs/config';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('encryption', () => {
    const text = 'some text';
    const encrypted = service.encrypt(text);
    const original = service.decrypt(encrypted);
    expect(original).toBe(text);
  });
});
