import { ownerLeaveGroupSchema } from '@transcendence/common';
import { createZodDto } from 'nestjs-zod';

export class OwnerLeaveGroupDto extends createZodDto(ownerLeaveGroupSchema) {}
