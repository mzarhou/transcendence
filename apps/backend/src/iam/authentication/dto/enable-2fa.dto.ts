import { createZodDto } from 'nestjs-zod';
import { enable2faSchema } from '@transcendence/types';

export class Enable2faDto extends createZodDto(enable2faSchema) {}
