import { signinSchema } from '@transcendence/db';
import { createZodDto } from 'nestjs-zod';

export class SignInDto extends createZodDto(signinSchema) {}
