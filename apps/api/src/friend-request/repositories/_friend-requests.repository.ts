import { Injectable } from '@nestjs/common';
import {
  FriendRequest,
  FriendRequestWithRecipient,
  FriendRequestWithRequester,
} from '@transcendence/db';
import { MakePropsUndefined } from '@src/groups/groups-common/repositories/_groups.repository';

export type FriendRequestFindWhere = <
  A extends true | false,
  B extends true | false,
>(args: {
  requesterId?: number;
  recipientId?: number;
  includeRecipient?: A;
  includeRequester?: B;
}) => Promise<
  (FriendRequest &
    (A extends true
      ? FriendRequestWithRecipient
      : MakePropsUndefined<FriendRequestWithRecipient>) &
    (B extends true
      ? FriendRequestWithRequester
      : MakePropsUndefined<FriendRequestWithRequester>))[]
>;

export type FriendRequestFindOneOrThrow = <
  A extends false | true = false,
  B extends false | true = false,
>(
  id: number,
  options?: {
    includeRequester?: A;
    includeRecipient?: B;
  },
) => Promise<
  (FriendRequest &
    (A extends true
      ? FriendRequestWithRequester
      : MakePropsUndefined<FriendRequestWithRequester>)) &
    (B extends true
      ? FriendRequestWithRecipient
      : MakePropsUndefined<FriendRequestWithRecipient>)
>;

@Injectable()
export abstract class FriendRequestsRepository {
  abstract create(args: {
    recipientId: number;
    requesterId: number;
  }): Promise<FriendRequest & FriendRequestWithRequester>;

  abstract findWhere: FriendRequestFindWhere;

  abstract findUsersFriendRequest(
    firstUserId: number,
    secondUserId: number,
  ): Promise<FriendRequest | null>;

  abstract findOneOrThrow: FriendRequestFindOneOrThrow;

  abstract destroy(id: number): Promise<FriendRequest>;

  abstract acceptFriendRequest(args: {
    friendRequestId: number;
    requesterId: number;
    recipientId: number;
  }): Promise<FriendRequest & FriendRequestWithRecipient>;
}
