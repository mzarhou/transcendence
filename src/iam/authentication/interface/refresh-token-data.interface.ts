import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';

export interface RefreshTokenData extends Pick<ActiveUserData, 'sub'> {
  refreshTokenId: string;
}
