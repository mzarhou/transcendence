import { Injectable } from '@nestjs/common';
import { MessageType, User, UserWithFriends } from '@transcendence/common';
import { MakePropsUndefined } from '@src/groups/repositories/_goups.repository';
import { MessageDto } from '../dto/message.dto';

export type MessagesFindOneOrThrow = <A extends boolean>(
  id: number,
  options?: {
    includeFriends?: A;
  },
) => Promise<
  User &
    (A extends true ? UserWithFriends : MakePropsUndefined<UserWithFriends>)
>;

@Injectable()
export abstract class MessagesRepository {
  abstract create(
    args: MessageDto & { senderId: number },
  ): Promise<MessageType>;

  abstract update(
    messageId: number,
    data: { isRead: boolean },
  ): Promise<MessageType>;

  abstract findOneOrThrow(messageId: number): Promise<MessageType>;

  abstract findAllFriendMessages(args: {
    userId: number;
    friendId: number;
  }): Promise<MessageType[]>;

  abstract findAllFiendsUnreadMessages(
    userId: number,
    friendsIds: number[],
  ): Promise<MessageType[]>;
}
