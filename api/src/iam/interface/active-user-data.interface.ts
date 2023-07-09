import { AppAbility } from '../authorization/ability.factory';

export interface ActiveUserData {
  /**
   * subject (user)
   * user id
   */
  sub: number;

  /**
   * is 2fa enabled for user
   */
  isTfaEnabled: boolean;

  /**
   * is 2fa provided
   */
  isTfaCodeProvided: boolean;

  /**
   * user authorization
   */
  allow(...args: Parameters<AppAbility['can']>): void;
}
