import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';

describe('App e2e test', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const BASE_URL = 'http://localhost:3334/';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3334);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  });

  afterAll(() => app.close());

  describe('Auth', () => {
    describe('Signup', () => {
      const userCredentials: AuthDto = {
        email: 'mati99@99.pl',
        password: 'somepassword',
      };
      it('should signup', () => {
        return pactum
          .spec()
          .post(`${BASE_URL}auth/signup`)
          .withBody(userCredentials)
          .expectStatus(201);
      });
    });
    describe('Signin', () => {});
  });

  describe('User', () => {
    describe('Get me', () => {});
    describe('Edit user', () => {});
  });

  describe('Bookmark', () => {
    describe('Get bookmarks', () => {});
    describe('Get bookmark by id', () => {});
    describe('Create bookmark', () => {});
    describe('Edit bookmark', () => {});
  });
});
