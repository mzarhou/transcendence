import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const jwtConfigSchema = z.object({
  JWT_SECRET: z.string().min(1),
  JWT_TOKEN_AUDIENCE: z.string().min(1),
  JWT_TOKEN_ISSUER: z.string().min(1),
  JWT_ACCESS_TOKEN_TTL: z.string().min(1).regex(/\d+/).transform(Number),
  JWT_REFRESH_TOKEN_TTL: z.string().min(1).regex(/\d+/).transform(Number),
});

export default registerAs('jwt', () => {
  const jwtConfig = jwtConfigSchema.parse(process.env);
  return {
    secret: jwtConfig.JWT_SECRET,
    audience: jwtConfig.JWT_TOKEN_AUDIENCE,
    issuer: jwtConfig.JWT_TOKEN_ISSUER,
    accessTokenTtl: jwtConfig.JWT_ACCESS_TOKEN_TTL,
    refreshTokenTtl: jwtConfig.JWT_REFRESH_TOKEN_TTL,
  };
});
