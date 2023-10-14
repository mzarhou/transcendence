import { sendGroupMessageSchema } from '@transcendence/db';
import { createZodDto } from 'nestjs-zod';

export class SendGroupMessageDto extends createZodDto(sendGroupMessageSchema) {}
