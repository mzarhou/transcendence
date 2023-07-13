import { searchSchema } from '@transcendence/common';
import { createZodDto } from 'nestjs-zod';

export class SearchUsersDto extends createZodDto(searchSchema) {}
