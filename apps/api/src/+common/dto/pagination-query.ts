import { paginationSchema } from '@transcendence/db';
import { createZodDto } from 'nestjs-zod';

export class PaginationQueryDto extends createZodDto(paginationSchema) {}
