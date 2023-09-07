import { muteUserSchema } from '@transcendence/common';
import { createZodDto } from 'nestjs-zod';

export class MuteUserDto extends createZodDto(muteUserSchema) {}
