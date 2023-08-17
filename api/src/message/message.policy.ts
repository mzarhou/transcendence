import { ForbiddenException, Injectable } from '@nestjs/common';
import { MessageType } from '@transcendence/common';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';

@Injectable()
export class MessagesPolicy {
  private requireRecipient(userId: number, message: MessageType) {
    if (userId === message.recipientId) return true;
    throw new ForbiddenException('You cannot mark message as read');
  }

  canMarkMessageAsRead(user: ActiveUserData, message: MessageType) {
    return this.requireRecipient(user.sub, message);
  }
}
