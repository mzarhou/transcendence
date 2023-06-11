export interface ActiveUserData {
  /**
   * subject (user)
   * user id
   */
  sub: number;

  /**
   * user email
   */
  email: string;

  /**
   * is 2fa enabled for user
   */
  isTfaEnabled: boolean;

  /**
   * is 2fa provided
   */
  isTfaCodeProvided: boolean;
}
