import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { GroupsService } from 'src/groups/groups.service';
import { AuthenticationService } from 'src/iam/authentication/authentication.service';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Group, GroupStatus } from '@prisma/client';

describe('GroupService int', () => {
  let prisma: PrismaService;
  let groupService: GroupsService;
  let authService: AuthenticationService;
  let hashingService: HashingService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    groupService = moduleRef.get(GroupsService);
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
        email,
        avatar: `https://avatars.dicebear.com/api/avataaars/${name}.svg`,
        name: 'testname',
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

  async function createAdmin(group: Group, groupOwner: ActiveUserData) {
    const admin = await createUser();
    await groupService.joinGroup(admin, group);
    await groupService.addGroupAdmin(groupOwner, group.id, {
      userId: admin.sub,
    });
    return admin;
  }

  async function createMember(group: Group) {
    const user = await createUser();
    await groupService.joinGroup(user, group);
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
      await createGroup(user, 'PROTECTED')
        .then((data) => expect(data).toBeFalsy())
        .catch((e) => expect(e).not.toBe(false));
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

      await groupService
        .create(user, { name, status: 'PUBLIC' })
        .catch((err) => expect(err).not.toBeFalsy());
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
      await groupService
        .update(user, createdGroup.id, { status: 'PUBLIC' })
        .then((data) => expect(data).toBeFalsy())
        .catch((e) => expect(e).not.toBeFalsy());
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
      await groupService
        .remove(user, id)
        .then((data) => expect(data).toBeFalsy())
        .catch((e) => expect(e).not.toBeFalsy());
      const group = await prisma.group.findFirst({
        where: { name },
      });
      expect(group?.name).toBe(name);
    }, 30000);
  });

  describe('add group admin', () => {
    let owner: ActiveUserData;
    let group: Group;

    it('should create group with one member', async () => {
      owner = await createUser();
      const _group = await createGroup(owner, 'PUBLIC');
      group = { ..._group, password: null };
    }, 30000);

    it('group owner should add admin', async () => {
      const admin = await createUser();
      await groupService.joinGroup(admin, group);
      await groupService.addGroupAdmin(owner, group.id, {
        userId: admin.sub,
      });
      const { users } = await groupService.findOne(group.id, {
        includeUsers: true,
      });
      const isAdmin = !!users.find(
        (u) => u.role === 'ADMIN' && u.userId === admin.sub,
      );
      expect(isAdmin).toBeTruthy();
    }, 30000);

    it('new admin should be member', async () => {
      const admin = await createUser();
      // admin isn't a member of group
      await groupService
        .addGroupAdmin(owner, group.id, {
          userId: admin.sub,
        })
        .then((data) => expect(data).toBeFalsy())
        .catch((e) => expect(e).toBeTruthy());
      const { users } = await groupService.findOne(group.id, {
        includeUsers: true,
      });
      const isAdmin = !!users.find(
        (u) => u.role === 'ADMIN' && u.userId === admin.sub,
      );
      expect(isAdmin).toBe(false);
    }, 30000);

    it('admins/members can not set admins', async () => {
      const member = await createMember(group);
      const admin = await createAdmin(group, owner);
      const targetUser = await createMember(group);

      await groupService
        .addGroupAdmin(member, group.id, { userId: targetUser.sub })
        .then((data) => expect(data).toBeFalsy())
        .catch((e) => expect(e).not.toBeFalsy());
      await groupService
        .addGroupAdmin(admin, group.id, { userId: targetUser.sub })
        .then((data) => expect(data).toBeFalsy())
        .catch((e) => expect(e).not.toBeFalsy());

      const { users } = await groupService.findOne(group.id, {
        includeUsers: true,
      });
      const isAdmin = !!users.find(
        (u) => u.role === 'ADMIN' && u.userId === targetUser.sub,
      );
      expect(isAdmin).toBe(false);
    }, 30000);
  });

  describe('remove admin', () => {
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
      const { users } = await groupService.findOne(group.id, {
        includeUsers: true,
      });
      const userGroup = users.find(
        (u) => u.role === 'ADMIN' && u.userId === admin.sub,
      );
      expect(userGroup).toBeFalsy();
    }, 30000);

    it('admins/users can not remove an admin', async () => {
      const admin = await createAdmin(group, owner);
      const targetAdmin = await createAdmin(group, owner);
      const member = await createMember(group);

      await groupService
        .removeGroupAdmin(member, group.id, {
          userId: targetAdmin.sub,
        })
        .then((data) => expect(data).toBeFalsy())
        .catch((e) => expect(e).toBeTruthy());
      await groupService
        .removeGroupAdmin(admin, group.id, {
          userId: targetAdmin.sub,
        })
        .then((data) => expect(data).toBeFalsy())
        .catch((e) => expect(e).toBeTruthy());

      const { users } = await groupService.findOne(group.id, {
        includeUsers: true,
      });
      const userGroup = users.find(
        (u) => u.role === 'ADMIN' && u.userId === targetAdmin.sub,
      );
      expect(userGroup).toBeTruthy();
    }, 30000);
  });

  describe('ban user', () => {
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

      const { users, blockedUsers } = await groupService.findOne(group.id, {
        includeBlockedUsers: true,
        includeUsers: true,
      });
      const isMember = !!users.find((u) => u.userId === user.sub);
      const isBanned = !!blockedUsers.find((u) => u.id === user.sub);
      const isAdminMember = !!users.find((u) => u.userId === admin.sub);
      const isAdminBanned = !!blockedUsers.find((u) => u.id === admin.sub);
      expect(isMember).toBeFalsy();
      expect(isBanned).toBeTruthy();
      expect(isAdminMember).toBeFalsy();
      expect(isAdminBanned).toBeTruthy();
    }, 30000);

    it('owner can not be banned', async () => {
      const admin = await createAdmin(group, owner);
      const user = await createMember(group);

      await groupService
        .banUser(admin, group.id, { userId: owner.sub })
        .then((data) => expect(data).toBeFalsy())
        .catch((e) => expect(e).toBeTruthy());
      await groupService
        .banUser(user, group.id, { userId: owner.sub })
        .then((data) => expect(data).toBeFalsy())
        .catch((e) => expect(e).toBeTruthy());
    }, 30000);

    it('admin can ban members', async () => {
      const admin = await createAdmin(group, owner);
      const user = await createMember(group);

      await groupService.banUser(admin, group.id, { userId: user.sub });

      const { users, blockedUsers } = await groupService.findOne(group.id, {
        includeBlockedUsers: true,
        includeUsers: true,
      });
      const isMember = !!users.find((u) => u.userId === user.sub);
      const isBanned = !!blockedUsers.find((u) => u.id === user.sub);
      expect(isMember).toBeFalsy();
      expect(isBanned).toBeTruthy();
    }, 30000);

    it('admin can not ban other admin', async () => {
      const admin1 = await createAdmin(group, owner);
      const admin2 = await createAdmin(group, owner);

      await groupService
        .banUser(admin1, group.id, { userId: admin2.sub })
        .then((data) => expect(data).toBeFalsy())
        .catch((e) => expect(e).toBeTruthy());
    }, 30000);

    it('member user can not ban other users/admins', async () => {
      const user1 = await createMember(group);
      const user2 = await createMember(group);
      const admin = await createAdmin(group, owner);

      await groupService
        .banUser(user1, group.id, { userId: user2.sub })
        .then((data) => expect(data).toBeFalsy())
        .catch((e) => expect(e).toBeTruthy());
      await groupService
        .banUser(user1, group.id, { userId: admin.sub })
        .then((data) => expect(data).toBeFalsy())
        .catch((e) => expect(e).toBeTruthy());
    }, 30000);
  });

  describe('unban user', () => {
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
      await groupService
        .unbanUser(owner, group.id, { userId: member.sub })
        .then((e) => expect(e).toBeTruthy())
        .catch((e) => expect(e).toBeFalsy());
    }, 30000);

    it('admin can unban members', async () => {
      const member = await createMember(group);
      const admin = await createAdmin(group, owner);

      await groupService.banUser(admin, group.id, { userId: member.sub });
      await groupService
        .unbanUser(admin, group.id, { userId: member.sub })
        .then((e) => expect(e).toBeTruthy())
        .catch((e) => expect(e).toBeFalsy());
    }, 30000);

    it('users can not unban other users', async () => {
      const user1 = await createMember(group);
      const user2 = await createMember(group);

      await groupService.banUser(owner, group.id, { userId: user1.sub });
      await groupService
        .unbanUser(user2, group.id, { userId: user1.sub })
        .then((e) => expect(e).toBeFalsy())
        .catch((e) => expect(e).toBeTruthy());
    }, 30000);
  });

  describe('kick user', () => {
    let owner: ActiveUserData;
    let group: Group;

    it('should create group with one member', async () => {
      owner = await createUser();
      const _group = await createGroup(owner, 'PUBLIC');
      group = { ..._group, password: null };
    }, 30000);

    it('owner can not be kicked out', async () => {
      const user = await createUser();
      await groupService.joinGroup(user, group);

      const admin = await createUser();
      await groupService.joinGroup(admin, group);
      await groupService.addGroupAdmin(owner, group.id, { userId: admin.sub });

      await groupService
        .kickUser(admin, group.id, { userId: owner.sub })
        .then((data) => expect(data).toBe(undefined))
        .catch((e) => expect(e).toBeTruthy());
      await groupService
        .kickUser(user, group.id, { userId: owner.sub })
        .then((data) => expect(data).toBe(undefined))
        .catch((e) => expect(e).toBeTruthy());
      const { users } = await groupService.findOne(group.id, {
        includeUsers: true,
      });
      expect(users.find((u) => u.userId === owner.sub)).toBeTruthy();
    });

    it('owner can kick user', async () => {
      const user = await createUser();
      await groupService.joinGroup(user, group);

      const admin = await createUser();
      await groupService.joinGroup(admin, group);
      await groupService.addGroupAdmin(owner, group.id, { userId: admin.sub });

      await groupService.kickUser(owner, group.id, { userId: user.sub });
      await groupService.kickUser(owner, group.id, { userId: admin.sub });

      const { users, blockedUsers } = await groupService.findOne(group.id, {
        includeBlockedUsers: true,
        includeUsers: true,
      });
      const isMember = !!users.find((u) => u.userId === user.sub);
      const isBanned = !!blockedUsers.find((u) => u.id === user.sub);
      expect(isMember).toBeFalsy();
      expect(isBanned).toBeFalsy();

      const isAdminMember = !!users.find((u) => u.userId === user.sub);
      const isAdminBanned = !!blockedUsers.find((u) => u.id === user.sub);
      expect(isAdminMember).toBeFalsy();
      expect(isAdminBanned).toBeFalsy();
    });

    it('admin can kick user', async () => {
      const user = await createUser();
      const admin = await createUser();

      await groupService.joinGroup(user, group);
      await groupService.joinGroup(admin, group);
      await groupService.addGroupAdmin(owner, group.id, { userId: admin.sub });
      await groupService.kickUser(admin, group.id, { userId: user.sub });

      const { users, blockedUsers } = await groupService.findOne(group.id, {
        includeBlockedUsers: true,
        includeUsers: true,
      });
      const isMember = !!users.find((u) => u.userId === user.sub);
      const isBanned = !!blockedUsers.find((u) => u.id === user.sub);
      expect(isMember).toBeFalsy();
      expect(isBanned).toBeFalsy();
    });

    it('users can not kick admins', async () => {
      const admin = await createUser();
      const user = await createUser();

      await groupService.joinGroup(user, group);
      await groupService.joinGroup(admin, group);
      await groupService.addGroupAdmin(owner, group.id, { userId: admin.sub });

      await groupService
        .kickUser(user, group.id, { userId: admin.sub })
        .then((data) => expect(data).toBeFalsy())
        .catch((e) => expect(e).toBeTruthy());
      const { users } = await groupService.findOne(group.id, {
        includeUsers: true,
      });
      const isAdminMember = !!users.find((u) => u.userId === user.sub);
      expect(isAdminMember).toBeTruthy();
    });
  });
});
