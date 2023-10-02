import { sendGroupMessageSchema } from '@transcendence/common';
import { createZodDto } from 'nestjs-zod';

export class SendGroupMessageDto extends createZodDto(sendGroupMessageSchema) {}
