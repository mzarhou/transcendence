import { ownerLeaveGroupSchema } from '@transcendence/db';
import { createZodDto } from 'nestjs-zod';

export class OwnerLeaveGroupDto extends createZodDto(ownerLeaveGroupSchema) {}
