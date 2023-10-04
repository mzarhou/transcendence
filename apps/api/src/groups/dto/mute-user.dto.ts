import { muteUserSchema } from '@transcendence/db';
import { createZodDto } from 'nestjs-zod';

export class MuteUserDto extends createZodDto(muteUserSchema) {}
