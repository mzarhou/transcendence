import { searchSchema } from '@transcendence/db';
import { createZodDto } from 'nestjs-zod';

export class SearchUsersDto extends createZodDto(searchSchema) {}
