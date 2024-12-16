import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreatePostDto } from 'src/post/dto';
import { AddCommentDto } from 'src/comment/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    await app.listen(0);
    const server = app.getHttpServer();
    const address = server.address();

    prisma = app.get(PrismaService);

    await prisma.cleanDb();
    pactum.request.setBaseUrl(`http://localhost:${address.port}`);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'User@test.com',
      password: 'user123',
    };
    describe('Register', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/api/users/register')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/api/users/register')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/api/users/register').expectStatus(400);
      });

      it('should register', () => {
        return pactum
          .spec()
          .post('/api/users/register')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Login', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/api/users/login')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/api/users/login')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/api/users/login').expectStatus(400);
      });

      it('should login', () => {
        return pactum
          .spec()
          .post('/api/users/login')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get user', () => {
      it('should get user profile', () => {
        return pactum
          .spec()
          .get('/api/users/profile')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          email: 'User1@test.com',
        };
        return pactum
          .spec()
          .patch('/api/users/profile')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200);
      });
    });
  });

  describe('Post', () => {
    describe('Create post', () => {
      it('should create user', () => {
        const dto: CreatePostDto = {
          title: 'Hello!',
          content: 'Saying Hello!',
        };

        return pactum
          .spec()
          .post('/api/posts')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(201)
          .stores('postId', 'id');
      });
    });

    describe('Get all post', () => {
      it('should return all post', () => {
        return pactum
          .spec()
          .get('/api/posts')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });

    describe('Get post by id', () => {
      it('should return one post', () => {
        return pactum
          .spec()
          .get('/api/posts/{id}')
          .withPathParams('id', '$S{postId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });
  });

  describe('Comment', () => {
    it('Add comment', () => {
      const dto: AddCommentDto = { content: 'Nice Blog!' };
      return pactum
        .spec()
        .post('/api/posts/{id}/comments')
        .withPathParams('id', '$S{postId}')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .withBody(dto)
        .expectStatus(201);
    });

    describe('Get comment of post ', () => {
      it('Add comment', () => {
        const dto: AddCommentDto = { content: 'Nice Blog!' };
        return pactum
          .spec()
          .get('/api/posts/{id}/comments')
          .withPathParams('id', '$S{postId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });
  });
});
