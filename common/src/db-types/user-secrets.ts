import { User } from "./users";

export interface UserSecrets {
  id: number;

  password: string | null;
  tfaSecret: string | null;

  userId: number;
}

export interface UserSecretsWithUser {
  user: User;
}
