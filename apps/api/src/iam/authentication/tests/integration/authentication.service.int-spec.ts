import { Test } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { PrismaService } from '@src/+prisma/prisma.service';
import { AuthenticationService } from '../../authentication.service';
import { faker } from '@faker-js/faker';

describe('AuthenticationService int', () => {
  let prisma: PrismaService;
  let authService: AuthenticationService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    authService = moduleRef.get(AuthenticationService);
    await prisma.cleanDb();
  }, 30000);

  afterAll(() => prisma.$disconnect());

  describe('signup', () => {
    it('signUp', async () => {
      const data = {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
      };
      await expect(authService.signUp(data)).resolves.toBeDefined();

      const user = await prisma.user.findFirstOrThrow({
        where: { email: data.email },
        include: { secrets: true },
      });
      expect(user.name).toBe(data.name);
      expect(
        user.secrets!.password!.length > data.password.length,
      ).toBeTruthy();
    });

    it('signUp unique name', async () => {
      const data = {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
      };
      await authService.signUp(data);
      await expect(
        authService.signUp({ ...data, email: faker.internet.email() }),
      ).rejects.toBeTruthy();
    });
  });

  describe('signin with email', () => {
    const data = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8 }),
    };

    it('should throw on user does not exists', async () => {
      await expect(authService.signIn(data, '')).rejects.toBeTruthy();
    });

    it('user should signin', async () => {
      await authService.signUp(data);
      await expect(authService.signIn(data, '')).resolves.toBeTruthy();
      const user = await prisma.user.findFirst({ where: { name: data.name } });
      expect(user).toBeTruthy();
    });
  });
});
