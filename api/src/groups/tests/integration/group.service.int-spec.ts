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
    let user: ActiveUserData;
    it('should create a user', async () => {
      user = await createUser();
    }, 30000);

    it('group owner should add admin', async () => {
      const newAdmin = await createUser();
      const group = await createGroup(user, 'PUBLIC');
      // add user to group
      await groupService.joinGroup(newAdmin, { ...group, password: '' });
      await groupService.addGroupAdmin(user, group.id, {
        userId: newAdmin.sub,
      });
      const { users } = await prisma.group.findFirstOrThrow({
        where: { id: group.id },
        include: { users: true },
      });
      const admin = users.find(
        (u) => u.role === 'ADMIN' && u.userId === newAdmin.sub,
      );
      expect(admin).toBeTruthy();
    }, 30000);

    it('admins/users can not add admins', async () => {
      const newAdmin = await createUser();
      const groupOwner = await createUser();
      const group = await createGroup(groupOwner, 'PUBLIC');
      await groupService.joinGroup(newAdmin, { ...group, password: '' });
      await groupService
        .addGroupAdmin(user, group.id, {
          userId: newAdmin.sub,
        })
        .then((data) => expect(data).toBeFalsy())
        .catch((e) => expect(e).not.toBeFalsy());
      const { users } = await prisma.group.findFirstOrThrow({
        where: { id: group.id },
        include: { users: true },
      });
      const isAdminSet = !!users.find(
        (u) => u.role === 'ADMIN' && u.userId === newAdmin.sub,
      );
      expect(isAdminSet).toBe(false);
    }, 30000);
  });

  describe('remove admin', () => {
    let user: ActiveUserData;
    it('should create a user', async () => {
      user = await createUser();
    }, 30000);

    it('group owner should remove an admin', async () => {
      const newAdmin = await createUser();
      let group = await createGroup(user, 'PUBLIC');
      await groupService.joinGroup(newAdmin, { ...group, password: '' });
      await groupService.addGroupAdmin(user, group.id, {
        userId: newAdmin.sub,
      });

      await groupService.removeGroupAdmin(user, group.id, {
        userId: newAdmin.sub,
      });
      const { users } = await groupService.findOne(group.id, {
        includeUsers: true,
      });
      const userGroup = users.find(
        (u) => u.role === 'ADMIN' && u.userId === newAdmin.sub,
      );
      expect(userGroup).toBeFalsy();
    }, 30000);

    it('admins/users can not remove an admin', async () => {
      const newAdmin = await createUser();
      const groupOwner = await createUser();
      let group = await createGroup(groupOwner, 'PUBLIC');
      await groupService.joinGroup(newAdmin, { ...group, password: '' });
      await groupService.addGroupAdmin(groupOwner, group.id, {
        userId: newAdmin.sub,
      });

      await groupService
        .removeGroupAdmin(user, group.id, {
          userId: newAdmin.sub,
        })
        .then((data) => expect(data).toBeFalsy())
        .catch((e) => expect(e).toBeTruthy());

      const { users } = await groupService.findOne(group.id, {
        includeUsers: true,
      });
      const userGroup = users.find(
        (u) => u.role === 'ADMIN' && u.userId === newAdmin.sub,
      );
      expect(userGroup).toBeTruthy();
    }, 30000);
  });

  describe('ban user', () => {
    let owner: ActiveUserData;
    let group: Omit<Group, 'password'>;

    it('should create group with one member', async () => {
      owner = await createUser();
      group = await createGroup(owner, 'PUBLIC');
    }, 30000);

    it('owner can ban members', async () => {
      const user = await createUser();
      await groupService.joinGroup(user, { ...group, password: '' });
      await groupService.banUser(owner, group.id, { userId: user.sub });

      const { users, blockedUsers } = await groupService.findOne(group.id, {
        includeBlockedUsers: true,
        includeUsers: true,
      });
      const isMember = !!users.find((u) => u.userId === user.sub);
      const isBanned = !!blockedUsers.find((u) => u.id === user.sub);
      expect(isMember).toBeFalsy();
      expect(isBanned).toBeTruthy();
    }, 30000);

    it('admin can ban members', async () => {
      const user = await createUser();
      const admin = await createUser();
      await groupService.joinGroup(user, { ...group, password: '' });
      await groupService.joinGroup(admin, { ...group, password: '' });
      await groupService.addGroupAdmin(owner, group.id, { userId: admin.sub });

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

    it('member user can not ban other users', async () => {
      const user1 = await createUser();
      const user2 = await createUser();
      await groupService.joinGroup(user1, { ...group, password: '' });
      await groupService.joinGroup(user2, { ...group, password: '' });

      await groupService
        .banUser(user1, group.id, {
          userId: user2.sub,
        })
        .then((data) => expect(data).toBeFalsy())
        .catch((e) => expect(e).toBeTruthy());
    }, 30000);

    it('admin can not ban other admin', async () => {
      const groupOwner = await createUser();
      const admin1 = await createUser();
      const admin2 = await createUser();
      const group = await createGroup(groupOwner, 'PUBLIC');
      await groupService.joinGroup(admin1, { ...group, password: '' });
      await groupService.joinGroup(admin2, { ...group, password: '' });
      await groupService.addGroupAdmin(groupOwner, group.id, {
        userId: admin1.sub,
      });
      await groupService.addGroupAdmin(groupOwner, group.id, {
        userId: admin2.sub,
      });
      await groupService
        .banUser(admin1, group.id, { userId: admin2.sub })
        .then((data) => expect(data).toBeFalsy())
        .catch((e) => expect(e).toBeTruthy());
    }, 30000);

    it('admin can not ban owner', async () => {
      const groupOwner = await createUser();
      const admin = await createUser();
      const group = await createGroup(groupOwner, 'PUBLIC');
      await groupService.joinGroup(admin, { ...group, password: '' });
      await groupService.addGroupAdmin(groupOwner, group.id, {
        userId: admin.sub,
      });
      await groupService
        .banUser(admin, group.id, { userId: groupOwner.sub })
        .then((data) => expect(data).toBeFalsy())
        .catch((e) => expect(e).toBeTruthy());
    }, 30000);
  });

  describe('unban user', () => {
    it('owner can unban members', async () => {
      const owner = await createUser();
      const member = await createUser();
      const group = await createGroup(owner, 'PUBLIC');
      await groupService.joinGroup(member, { ...group, password: '' });

      await groupService.banUser(owner, group.id, { userId: member.sub });
      await groupService
        .unbanUser(owner, group.id, { userId: member.sub })
        .then((e) => expect(e).toBeTruthy())
        .catch((e) => expect(e).toBeFalsy());
    }, 30000);

    it('admin can unban members', async () => {
      const owner = await createUser();
      const member = await createUser();
      const admin = await createUser();
      const group = await createGroup(owner, 'PUBLIC');
      await groupService.joinGroup(member, { ...group, password: '' });
      await groupService.joinGroup(admin, { ...group, password: '' });
      await groupService.addGroupAdmin(owner, group.id, { userId: admin.sub });

      await groupService.banUser(admin, group.id, { userId: member.sub });
      await groupService
        .unbanUser(admin, group.id, { userId: member.sub })
        .then((e) => expect(e).toBeTruthy())
        .catch((e) => expect(e).toBeFalsy());
    }, 30000);

    it('users can not unban other users', async () => {
      const owner = await createUser();
      const user1 = await createUser();
      const user2 = await createUser();
      const group = await createGroup(owner, 'PUBLIC');
      await groupService.joinGroup(user1, { ...group, password: '' });
      await groupService.joinGroup(user2, { ...group, password: '' });

      await groupService.banUser(owner, group.id, { userId: user1.sub });
      await groupService
        .unbanUser(user2, group.id, { userId: user1.sub })
        .then((e) => expect(e).toBeFalsy())
        .catch((e) => expect(e).toBeTruthy());
    }, 30000);
  });
});
