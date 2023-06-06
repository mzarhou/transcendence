import { Test, TestingModule } from '@nestjs/testing';
import { School42AuthController } from './school-42-auth.controller';

describe('School42AuthController', () => {
  let controller: School42AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [School42AuthController],
    }).compile();

    controller = module.get<School42AuthController>(School42AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
