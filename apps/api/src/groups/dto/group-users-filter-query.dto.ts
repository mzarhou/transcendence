import { groupUsersFilterSchema } from '@transcendence/db';
import { createZodDto } from 'nestjs-zod';

export class GroupUsersFilterDto extends createZodDto(groupUsersFilterSchema) {}
