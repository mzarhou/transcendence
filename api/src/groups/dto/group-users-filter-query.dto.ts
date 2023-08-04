import { groupUsersFilterSchema } from '@transcendence/common';
import { createZodDto } from 'nestjs-zod';

export class GroupUsersFilterDto extends createZodDto(groupUsersFilterSchema) {}
