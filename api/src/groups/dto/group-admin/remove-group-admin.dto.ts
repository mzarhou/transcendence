import { removeGroupAdminSchema } from '@transcendence/common';
import { createZodDto } from 'nestjs-zod';

export class RemoveGroupAdminDto extends createZodDto(removeGroupAdminSchema) {}
