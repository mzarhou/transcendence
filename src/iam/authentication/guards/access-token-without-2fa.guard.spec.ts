import { AccessTokenWithout2faGuard } from './access-token-without-2fa.guard';

describe('AccessTokenWithout2faGuard', () => {
  it('should be defined', () => {
    expect(new AccessTokenWithout2faGuard()).toBeDefined();
  });
});
