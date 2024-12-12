import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';

import { UsersController } from '@/modules/api/users/users.controller';
import { UsersService } from '@/modules/api/users/users.service';
import { ApiPathEnum } from '@/common/types';

describe('UserController (e2e)', () => {
    let app: INestApplication;
    let userService = {
        createOne: jest.fn(),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: userService,
                },
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });


    // describe('/GET user/:id', () => {
    //     it('should return a user by id', async () => {
    //         // тест на успешное получение пользователя
    //     });

    it('/POST createOne (success)', async () => {
        const createUserDto = { email: 'test@example.com', password: 'test123' };
        userService.createOne.mockResolvedValue({ id: 1, ...createUserDto });

        const response = await request(app.getHttpServer())
            .post(`/${ApiPathEnum.USERS}`)
            .send(createUserDto)
        // .    (HttpStatus.CREATED);

        expect(response.statusCode).toEqual(HttpStatus.CREATED)
        expect(response.body)
        // expect(response.body).toEqual({
        //     id: 1,
        //     email: 'test@example.com',
        //     password: 'test123', // можно замокать хеширование пароля в реальном сценарии
        // });
    });

    // it('/POST createOne (conflict)', async () => {
    //     const createUserDto = { email: 'test@example.com', password: 'test123' };
    //     userService.createOne.mockRejectedValue({
    //         statusCode: HttpStatus.CONFLICT,
    //         message: 'Email already exists',
    //     });

    //     const response = await request(app.getHttpServer())
    //         .post('/user')
    //         .send(createUserDto)
    //         .expect(HttpStatus.CONFLICT);

    //     expect(response.body).toEqual({
    //         statusCode: HttpStatus.CONFLICT,
    //         message: 'Email already exists',
    //     });
    // });

    // it('/POST createOne (bad request)', async () => {
    //     const invalidUserDto = { email: 'invalid-email', password: '12' };

    //     const response = await request(app.getHttpServer())
    //         .post('/user')
    //         .send(invalidUserDto)
    //         .expect(HttpStatus.BAD_REQUEST);

    //     expect(response.body).toEqual({
    //         statusCode: HttpStatus.BAD_REQUEST,
    //         message: expect.any(String),
    //     });
    // });

    // it('/POST createOne (forbidden)', async () => {
    //     const createUserDto = { email: 'test@example.com', password: 'test123' };

    //     userService.createOne.mockRejectedValue({
    //         statusCode: HttpStatus.FORBIDDEN,
    //         message: 'Access denied',
    //     });

    //     const response = await request(app.getHttpServer())
    //         .post('/user')
    //         .send(createUserDto)
    //         .expect(HttpStatus.FORBIDDEN);

    //     expect(response.body).toEqual({
    //         statusCode: HttpStatus.FORBIDDEN,
    //         message: 'Access denied',
    //     });
    // });
});
