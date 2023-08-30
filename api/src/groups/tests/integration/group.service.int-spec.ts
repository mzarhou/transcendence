import { Test } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { GroupsService } from '@src/groups/groups.service';
import { AuthenticationService } from '@src/iam/authentication/authentication.service';
import { HashingService } from '@src/iam/hashing/hashing.service';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { PrismaService } from '@src/+prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Group, GroupStatus } from '@prisma/client';
import { GroupsRepository } from '@src/groups/repositories/_goups.repository';

describe('GroupService int', () => {
  let prisma: PrismaService;
  let groupService: GroupsService;
  let groupsRepository: GroupsRepository;
  let authService: AuthenticationService;
  let hashingService: HashingService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    groupService = moduleRef.get(GroupsService);
    groupsRepository = moduleRef.get(GroupsRepository);
    authService = moduleRef.get(AuthenticationService);
    hashingService = moduleRef.get(HashingService);
    await prisma.cleanDb();
  }, 30000);

  afterAll(() => prisma.$disconnect());

  async function createUser() {
    const name = faker.internet.userName();
    const email = faker.internet.email();

    const dbUser = await prisma.user.create({
      data: {
        name,
        email,
        avatar: `https://avatars.dicebear.com/api/avataaars/${name}.svg`,
        secrets: {
          create: {
            password: await hashingService.hash('testpassword'),
          },
        },
      },
    });
    const { accessToken } = await authService.generateTokens(dbUser, '');
    return authService.getUserFromToken(accessToken);
  }

  async function createAdmin(
    group: Group,
    groupOwner: ActiveUserData,
    groupPassword?: string,
  ) {
    const admin = await createUser();
    await groupService.joinGroup(admin, group.id, { password: groupPassword });
    await groupService.addGroupAdmin(groupOwner, group.id, {
      userId: admin.sub,
    });
    return admin;
  }

  async function createMember(group: Group, groupPassword?: string) {
    const user = await createUser();
    await groupService.joinGroup(user, group.id, { password: groupPassword });
    return user;
  }

  /**
   * create a group with random name
   */
  async function createGroup(
    user: ActiveUserData,
    status: GroupStatus,
    password?: string,
  ) {
    return groupService.create(user, {
      name: faker.company.name(),
      status: status,
      password,
    });
  }

  describe('create group', () => {
    let user: ActiveUserData;
    it('should create a user', async () => {
      user = await createUser();
    }, 30000);

    it('should create public group', async () => {
      const { name } = await createGroup(user, 'PUBLIC');
      const group = await prisma.group.findFirst({
        where: { name },
      });
      expect(group?.name).toBe(name);
      expect(group?.status).toBe('PUBLIC');
    }, 30000);

    it('protected group should created with password', async () => {
      await expect(createGroup(user, 'PROTECTED')).rejects.toBeDefined();

      const groupPassword = 'some-password';
      const { name } = await createGroup(user, 'PROTECTED', groupPassword);
      const group = await prisma.group.findFirst({ where: { name } });
      expect(group?.name).toBe(name);
      expect(group?.password).not.toBeFalsy();
      // password must be hashed
      expect(
        (group?.password?.length ?? 0) > groupPassword.length,
      ).toBeTruthy();
    }, 30000);

    it('should throw on duplicate name', async () => {
      const { name } = await createGroup(user, 'PUBLIC');

      await expect(
        groupService.create(user, { name, status: 'PUBLIC' }),
      ).rejects.toBeDefined();
    }, 30000);
  });

  describe('update group', () => {
    let user: ActiveUserData;
    it('should create a user', async () => {
      user = await createUser();
    }, 30000);

    it('owner can update group', async () => {
      const createdGroup = await createGroup(user, 'PRIVATE');
      await groupService.update(user, createdGroup.id, { status: 'PUBLIC' });

      const group = await prisma.group.findFirstOrThrow({
        where: { name: createdGroup.name },
      });
      expect(group.status).toBe('PUBLIC');
    }, 30000);

    it('user/admin can not update group', async () => {
      const groupOwner = await createUser();
      const createdGroup = await createGroup(groupOwner, 'PRIVATE');
      await expect(
        groupService.update(user, createdGroup.id, { status: 'PUBLIC' }),
      ).rejects.toBeDefined();

      const group = await prisma.group.findFirstOrThrow({
        where: { name: createdGroup.name },
      });
      expect(group.status).toBe('PRIVATE');
    }, 30000);
  });

  describe('delete group', () => {
    let user: ActiveUserData;
    it('should create a user', async () => {
      user = await createUser();
    }, 30000);

    it('owner can delete group', async () => {
      const groupName = faker.company.name();
      const { id } = await createGroup(user, 'PRIVATE');
      await groupService.remove(user, id);
      const group = await prisma.group.findFirst({
        where: { name: groupName },
      });
      expect(group).toBeFalsy();
    }, 30000);

    it('user/admin can not delete group', async () => {
      const groupOwner = await createUser();
      const { id, name } = await createGroup(groupOwner, 'PRIVATE');
      await expect(groupService.remove(user, id)).rejects.toBeDefined();
      const group = await prisma.group.findFirst({
        where: { name },
      });
      expect(group?.name).toBe(name);
    }, 30000);
  });

  describe('addGroupAdmin', () => {
    let owner: ActiveUserData;
    let group: Group;

    it('should create group with one member', async () => {
      owner = await createUser();
      const _group = await createGroup(owner, 'PUBLIC');
      group = { ..._group, password: null };
    }, 30000);

    it('group owner should add admin', async () => {
      const admin = await createUser();
      await groupService.joinGroup(admin, group.id);
      await groupService.addGroupAdmin(owner, group.id, {
        userId: admin.sub,
      });
      const { users } = await groupsRepository.findOneOrThrow(group.id, {
        includeUsers: true,
      });
      const isAdmin = !!users.find(
        (u) => u.role === 'ADMIN' && u.id === admin.sub,
      );
      expect(isAdmin).toBeTruthy();
    }, 30000);

    it('new admin should be member', async () => {
      const admin = await createUser();
      // admin isn't a member of group
      await expect(
        groupService.addGroupAdmin(owner, group.id, {
          userId: admin.sub,
        }),
      ).rejects.toBeDefined();
      const { users } = await groupsRepository.findOneOrThrow(group.id, {
        includeUsers: true,
      });
      const isAdmin = !!users.find(
        (u) => u.role === 'ADMIN' && u.id === admin.sub,
      );
      expect(isAdmin).toBe(false);
    }, 30000);

    it('admins/members can not set admins', async () => {
      const member = await createMember(group);
      const admin = await createAdmin(group, owner);
      const targetUser = await createMember(group);

      await expect(
        groupService.addGroupAdmin(member, group.id, {
          userId: targetUser.sub,
        }),
      ).rejects.toBeDefined();
      await expect(
        groupService.addGroupAdmin(admin, group.id, { userId: targetUser.sub }),
      ).rejects.toBeDefined();

      const { users } = await groupsRepository.findOneOrThrow(group.id, {
        includeUsers: true,
      });
      const isAdmin = !!users.find(
        (u) => u.role === 'ADMIN' && u.id === targetUser.sub,
      );
      expect(isAdmin).toBe(false);
    }, 30000);
  });

  describe('removeGroupAdmin', () => {
    let owner: ActiveUserData;
    let group: Group;

    it('should create group with one member', async () => {
      owner = await createUser();
      const _group = await createGroup(owner, 'PUBLIC');
      group = { ..._group, password: null };
    }, 30000);

    it('group owner should remove an admin', async () => {
      const admin = await createAdmin(group, owner);

      await groupService.removeGroupAdmin(owner, group.id, {
        userId: admin.sub,
      });
      const { users } = await groupsRepository.findOneOrThrow(group.id, {
        includeUsers: true,
      });
      const userGroup = users.find(
        (u) => u.role === 'ADMIN' && u.id === admin.sub,
      );
      expect(userGroup).toBeFalsy();
    }, 30000);

    it('admins/users can not remove an admin', async () => {
      const admin = await createAdmin(group, owner);
      const targetAdmin = await createAdmin(group, owner);
      const member = await createMember(group);

      await expect(
        groupService.removeGroupAdmin(member, group.id, {
          userId: targetAdmin.sub,
        }),
      ).rejects.toBeDefined();

      await expect(
        groupService.removeGroupAdmin(admin, group.id, {
          userId: targetAdmin.sub,
        }),
      ).rejects.toBeDefined();

      const { users } = await groupsRepository.findOneOrThrow(group.id, {
        includeUsers: true,
      });
      const userGroup = users.find(
        (u) => u.role === 'ADMIN' && u.id === targetAdmin.sub,
      );
      expect(userGroup).toBeTruthy();
    }, 30000);
  });

  describe('banUser', () => {
    let owner: ActiveUserData;
    let group: Group;

    it('should create group with one member', async () => {
      owner = await createUser();
      const _group = await createGroup(owner, 'PUBLIC');
      group = { ..._group, password: '' };
    }, 30000);

    it('owner can ban any one', async () => {
      const user = await createMember(group);
      const admin = await createAdmin(group, owner);

      await groupService.banUser(owner, group.id, { userId: user.sub });
      await groupService.banUser(owner, group.id, { userId: admin.sub });

      const { users, blockedUsers } = await groupsRepository.findOneOrThrow(
        group.id,
        {
          includeBlockedUsers: true,
          includeUsers: true,
        },
      );
      const isMember = !!users.find((u) => u.id === user.sub);
      const isBanned = !!blockedUsers.find((u) => u.id === user.sub);
      const isAdminMember = !!users.find((u) => u.id === admin.sub);
      const isAdminBanned = !!blockedUsers.find((u) => u.id === admin.sub);
      expect(isMember).toBeFalsy();
      expect(isBanned).toBeTruthy();
      expect(isAdminMember).toBeFalsy();
      expect(isAdminBanned).toBeTruthy();
    }, 30000);

    it('owner can not be banned', async () => {
      const admin = await createAdmin(group, owner);
      const user = await createMember(group);

      await expect(
        groupService.banUser(admin, group.id, { userId: owner.sub }),
      ).rejects.toBeDefined();
      await expect(
        groupService.banUser(user, group.id, { userId: owner.sub }),
      ).rejects.toBeDefined();
    }, 30000);

    it('admin can ban members', async () => {
      const admin = await createAdmin(group, owner);
      const user = await createMember(group);

      await groupService.banUser(admin, group.id, { userId: user.sub });

      const { users, blockedUsers } = await groupsRepository.findOneOrThrow(
        group.id,
        {
          includeBlockedUsers: true,
          includeUsers: true,
        },
      );
      const isMember = !!users.find((u) => u.id === user.sub);
      const isBanned = !!blockedUsers.find((u) => u.id === user.sub);
      expect(isMember).toBeFalsy();
      expect(isBanned).toBeTruthy();
    }, 30000);

    it('admin can not ban other admin', async () => {
      const admin1 = await createAdmin(group, owner);
      const admin2 = await createAdmin(group, owner);

      await expect(
        groupService.banUser(admin1, group.id, { userId: admin2.sub }),
      ).rejects.toBeDefined();
    }, 30000);

    it('member user can not ban other users/admins', async () => {
      const user1 = await createMember(group);
      const user2 = await createMember(group);
      const admin = await createAdmin(group, owner);

      await expect(
        groupService.banUser(user1, group.id, { userId: user2.sub }),
      ).rejects.toBeDefined();
      await expect(
        groupService.banUser(user1, group.id, { userId: admin.sub }),
      ).rejects.toBeDefined();
    }, 30000);
  });

  describe('unbanUser', () => {
    let owner: ActiveUserData;
    let group: Group;

    it('should create group with one member', async () => {
      owner = await createUser();
      const _group = await createGroup(owner, 'PUBLIC');
      group = { ..._group, password: '' };
    }, 30000);

    it('owner can unban members', async () => {
      const member = await createMember(group);

      await groupService.banUser(owner, group.id, { userId: member.sub });
      await expect(
        groupService.unbanUser(owner, group.id, { userId: member.sub }),
      ).resolves.toBeDefined();
    }, 30000);

    it('admin can unban members', async () => {
      const member = await createMember(group);
      const admin = await createAdmin(group, owner);

      await groupService.banUser(admin, group.id, { userId: member.sub });
      await expect(
        groupService.unbanUser(admin, group.id, { userId: member.sub }),
      ).resolves.toBeDefined();
    }, 30000);

    it('users can not unban other users', async () => {
      const user1 = await createMember(group);
      const user2 = await createMember(group);

      await groupService.banUser(owner, group.id, { userId: user1.sub });
      await expect(
        groupService.unbanUser(user2, group.id, { userId: user1.sub }),
      ).rejects.toBeDefined();
    }, 30000);
  });

  describe('kickUser', () => {
    let owner: ActiveUserData;
    let group: Group;

    it('should create group with one member', async () => {
      owner = await createUser();
      const _group = await createGroup(owner, 'PUBLIC');
      group = { ..._group, password: null };
    }, 30000);

    it('owner can not be kicked out', async () => {
      const admin = await createAdmin(group, owner);
      const user = await createMember(group);

      await expect(
        groupService.kickUser(admin, group.id, { userId: owner.sub }),
      ).rejects.toBeDefined();
      await expect(
        groupService.kickUser(user, group.id, { userId: owner.sub }),
      ).rejects.toBeDefined();
      const { users } = await groupsRepository.findOneOrThrow(group.id, {
        includeUsers: true,
      });
      expect(users.find((u) => u.id === owner.sub)).toBeTruthy();
    });

    it('owner can kick member/admin', async () => {
      const user = await createMember(group);
      const admin = await createAdmin(group, owner);

      await groupService.kickUser(owner, group.id, { userId: user.sub });
      await groupService.kickUser(owner, group.id, { userId: admin.sub });

      const { users, blockedUsers } = await groupsRepository.findOneOrThrow(
        group.id,
        {
          includeBlockedUsers: true,
          includeUsers: true,
        },
      );
      const isMember = !!users.find((u) => u.id === user.sub);
      const isBanned = !!blockedUsers.find((u) => u.id === user.sub);
      expect(isMember).toBeFalsy();
      expect(isBanned).toBeFalsy();

      const isAdminMember = !!users.find((u) => u.id === user.sub);
      const isAdminBanned = !!blockedUsers.find((u) => u.id === user.sub);
      expect(isAdminMember).toBeFalsy();
      expect(isAdminBanned).toBeFalsy();
    });

    it('admin can kick member', async () => {
      const user = await createMember(group);
      const admin = await createAdmin(group, owner);

      await groupService.kickUser(admin, group.id, { userId: user.sub });

      const { users, blockedUsers } = await groupsRepository.findOneOrThrow(
        group.id,
        {
          includeBlockedUsers: true,
          includeUsers: true,
        },
      );
      const isMember = !!users.find((u) => u.id === user.sub);
      const isBanned = !!blockedUsers.find((u) => u.id === user.sub);
      expect(isMember).toBeFalsy();
      expect(isBanned).toBeFalsy();
    });

    it('members can not kick admins/members', async () => {
      const user = await createMember(group);
      const targetAdmin = await createAdmin(group, owner);
      const targetUser = await createMember(group);

      await expect(
        groupService.kickUser(user, group.id, { userId: targetAdmin.sub }),
      ).rejects.toBeDefined();
      await expect(
        groupService.kickUser(user, group.id, { userId: targetUser.sub }),
      ).rejects.toBeDefined();
      const { users } = await groupsRepository.findOneOrThrow(group.id, {
        includeUsers: true,
      });
      const isAdminMember = !!users.find((u) => u.id === targetAdmin.sub);
      const isUserMember = !!users.find((u) => u.id === targetUser.sub);
      expect(isAdminMember).toBeTruthy();
      expect(isUserMember).toBeTruthy();
    });
  });

  describe('joinGroup', () => {
    let owner: ActiveUserData;

    it('should create group owner', async () => {
      owner = await createUser();
    }, 30000);

    it('users can join public group', async () => {
      const user = await createUser();
      const publicGroup = await createGroup(owner, 'PUBLIC');

      await groupService.joinGroup(user, publicGroup.id);
      const { users } = await groupsRepository.findOneOrThrow(publicGroup.id, {
        includeUsers: true,
      });
      const isMember = users.find((u) => u.id === user.sub);
      expect(isMember).toBeTruthy();
    });

    it('users can not join private group', async () => {
      const user = await createUser();
      const privateGroup = await createGroup(owner, 'PRIVATE');

      await expect(
        groupService.joinGroup(user, privateGroup.id),
      ).rejects.toBeDefined();

      const { users } = await groupsRepository.findOneOrThrow(privateGroup.id, {
        includeUsers: true,
      });
      const isMember = users.find((u) => u.id === user.sub);
      expect(isMember).toBeFalsy();
    });

    it('users can not join protected group with incorrect password', async () => {
      const user = await createUser();
      const protectedGroup = await createGroup(owner, 'PROTECTED', 'pass123');

      await expect(
        groupService.joinGroup(user, protectedGroup.id, {
          password: 'incorrect password',
        }),
      ).rejects.toBeDefined();

      const { users } = await groupsRepository.findOneOrThrow(
        protectedGroup.id,
        {
          includeUsers: true,
        },
      );
      const isMember = !!users.find((u) => u.id === user.sub);
      expect(isMember).toBeFalsy();
    });

    it('users can join protected group with correct password', async () => {
      const password = 'pass123';
      const user = await createUser();
      const protectedGroup = await createGroup(owner, 'PROTECTED', password);

      await expect(
        groupService.joinGroup(user, protectedGroup.id, { password }),
      ).resolves.toBeDefined();

      const { users } = await groupsRepository.findOneOrThrow(
        protectedGroup.id,
        {
          includeUsers: true,
        },
      );
      const isMember = users.find((u) => u.id === user.sub);
      expect(isMember).toBeTruthy();
    });
  });

  describe('leaveGroup', () => {
    let owner: ActiveUserData;
    let group: Group;

    it('should create group with one member', async () => {
      owner = await createUser();
      const _group = await createGroup(owner, 'PUBLIC');
      group = { ..._group, password: null };
    }, 30000);

    it('owner can leave the group', async () => {
      const owner = await createUser();
      const group = await createGroup(owner, 'PUBLIC');
      const user = await createMember({ ...group, password: '' });

      await expect(
        groupService.leaveGroup(owner, group.id, { newOwnerId: user.sub }),
      ).resolves.toBeDefined();

      const newGroup = await groupsRepository.findOneOrThrow(group.id, {
        includeUsers: true,
      });
      expect(newGroup.ownerId).toBe(user.sub);
      expect(newGroup.users.find((u) => u.id === owner.sub)).toBe(undefined);
    });

    it('should throw if owner leave without setting a new ownerId', async () => {
      const owner = await createUser();
      const group = await createGroup(owner, 'PUBLIC');

      await expect(
        groupService.leaveGroup(owner, group.id, {}),
      ).rejects.toBeDefined();
    });

    it('admins/members can leave a group', async () => {
      const member = await createMember(group);
      const admin = await createAdmin(group, owner);

      await groupService.leaveGroup(admin, group.id, {});
      await groupService.leaveGroup(member, group.id, {});

      const { users, ownerId } = await groupsRepository.findOneOrThrow(
        group.id,
        {
          includeUsers: true,
        },
      );

      const isMemberExist = !!users.find((u) => u.id === member.sub);
      const isAdminExist = !!users.find((u) => u.id === admin.sub);
      expect(isMemberExist).toBe(false);
      expect(isAdminExist).toBe(false);
      expect(ownerId).toBe(owner.sub);
    });
  });
});
