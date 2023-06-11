import { Test, TestingModule } from '@nestjs/testing';
import { OtpAuthenticationController } from './otp-authentication.controller';

describe('TfaController', () => {
  let controller: OtpAuthenticationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtpAuthenticationController],
    }).compile();

    controller = module.get<OtpAuthenticationController>(
      OtpAuthenticationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
