import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import * as assert from 'assert';
import { CreateBookmarkDto, UpdateBookmarkDto } from '../src/bookmark/dto';

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
    describe('Sign in', () => {
      it('Should sign in with given credentials', () => {
        return pactum
          .spec()
          .post('auth/signin')
          .withBody(userCredentials)
          .expectStatus(200)
          .expectJsonLike({
            accessToken: /^ey.*/,
          })
          .stores('userAt', 'accessToken');
      });
      it('Should sign in with given credentials', () => {
        return pactum
          .spec()
          .post('auth/signin')
          .withBody(userCredentials)
          .expectStatus(200)
          .expectJsonLike({
            accessToken: /^ey.*/,
          })
          .stores('userAt', 'accessToken');
      });
    });
  });

  describe('User', () => {
    describe('Get user information', () => {
      it('Should give information about user', () => {
        return pactum
          .spec()
          .get('users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
    it('Should correctly edit user', () => {
      const editedUser: EditUserDto = {
        email: 'mati@o2.pl',
        firstName: 'mati',
        lastName: 'password',
      };
      return pactum
        .spec()
        .patch('users')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(editedUser)
        .expectStatus(200)
        .expectBodyContains('mati@o2.pl')
        .expectBodyContains('mati')
        .expectBodyContains('password');
    });
  });

  describe('Bookmarks', () => {
    describe('Get empty bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'First Bookmark',
        link: 'https://www.youtube.com/watch?v=d6WC5n9G_sM',
      };
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post('bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get bookmark by id', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
          .inspect();
      });
    });

    describe('Edit bookmark by id', () => {
      const dto: UpdateBookmarkDto = {
        title:
          'Kubernetes Course - Full Beginners Tutorial (Containerize Your Apps!)',
        description:
          'Learn how to use Kubernetes in this complete course. Kubernetes makes it possible to containerize applications and simplifies app deployment to production.',
      };
      it('should edit bookmark', () => {
        return pactum
          .spec()
          .patch('bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });

    describe('Delete bookmark by id', () => {
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete('bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });

      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
