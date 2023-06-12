import z from 'zod';
import { createZodDto } from 'nestjs-zod';

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
  deviceId: z.string().min(1),
});

export class RefreshTokenDto extends createZodDto(refreshTokenSchema) {}
