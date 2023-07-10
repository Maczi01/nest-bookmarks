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
    pactum.request.setBaseUrl(BASE_URL);
  });

  afterAll(() => app.close());

  describe('Auth', () => {
    const userCredentials: AuthDto = {
      email: 'mati@o2.pl',
      password: 'somepassword',
    };
    describe('Signup', () => {
      it('Should signup with given credentials', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody(userCredentials)
          .expectStatus(201)
          .expectJsonLike({
            accessToken: /^ey.*/,
          });
      });
      it('Should reject signup with repeated credentials', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody(userCredentials)
          .expectStatus(403)
          .expectBodyContains('Credentials taken, try different email');
      });
      it('Should reject signup with incorrect email format', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody({ userCredentials, email: 'mati.pl' })
          .expectStatus(400)
          .expectBodyContains('email must be an email');
      });
    });
    describe('Signin', () => {
      // it('Should login with created user')
    });
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
