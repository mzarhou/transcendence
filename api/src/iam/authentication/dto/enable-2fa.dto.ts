import { createZodDto } from 'nestjs-zod';
import { enable2faSchema } from '@transcendence/common';

export class Enable2faDto extends createZodDto(enable2faSchema) {}
