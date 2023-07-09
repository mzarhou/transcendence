import { Test } from '@nestjs/testing';
import { FriendRequestService } from './friend-request.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import {
  createUser,
  getUserFriends,
  makeUsersFriends,
} from 'src/common/dto/utils/test-utils';

describe('FriendRequestService', () => {
  let friendRequestService: FriendRequestService;
  let prisma: PrismaService;
  let activeUser: ActiveUserData;
  let user1: User;
  let user2: User;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [FriendRequestService],
      imports: [PrismaModule],
    }).compile();

    friendRequestService =
      moduleRef.get<FriendRequestService>(FriendRequestService);
    prisma = moduleRef.get<PrismaService>(PrismaService);

    user1 = await createUser(prisma, 'user1');
    user2 = await createUser(prisma, 'user2');
    activeUser = {
      sub: user1.id,
      isTfaEnabled: false,
      isTfaCodeProvided: false,
    };
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
  });

  it('unfriend', async () => {
    await makeUsersFriends(prisma, user1, user2);
    const user1Friends = await getUserFriends(prisma, user1.id);
    expect(user1Friends.includes(user2.id)).toBe(true);

    await friendRequestService.unfriend(user2.id, activeUser);
    const newUser1Friends = await getUserFriends(prisma, user1.id);
    expect(newUser1Friends.includes(user2.id)).toBe(false);
  });

  it('accept friend request', async () => {
    const friendRequest = await prisma.friendRequest.create({
      data: {
        recipientId: user1.id,
        requesterId: user2.id,
      },
    });
    await friendRequestService.accept(friendRequest.id, activeUser);
    const activeUserFriends = await getUserFriends(prisma, user1.id);
    expect(activeUserFriends.includes(user2.id)).toBe(true);
  });
});
