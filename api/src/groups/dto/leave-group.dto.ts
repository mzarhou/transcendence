import { leaveGroupSchema } from '@transcendence/common';
import { createZodDto } from 'nestjs-zod';

export class LeaveGroupDto extends createZodDto(leaveGroupSchema) {}
