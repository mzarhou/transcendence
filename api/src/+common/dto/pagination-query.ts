import { paginationSchema } from '@transcendence/common';
import { createZodDto } from 'nestjs-zod';

export class PaginationQueryDto extends createZodDto(paginationSchema) {}
