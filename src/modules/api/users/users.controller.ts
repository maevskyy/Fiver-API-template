import { InternalLogger } from '@/common';
import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import {
    UserGetAllResDTO,
    UserGetOneResDTO,
    UserGetOneDTO,
    UserErrorBadRequest,
    UserCreateErrorConflict,
    UserErrorForbidden,
    UserCreateResDTO,
    UserCreateDTO,
    UserErrorNotFoundDTO,
} from './dto';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { UserUpdateDTO, UserUpdateResDTO } from './dto/updateUser.dto';
import { ApiPathEnum, UsersEndpoitEnum } from '@/common/types';
import { SwaggerController } from '@/common/decorators';

@ApiTags('Users')
@Controller(ApiPathEnum.USERS)
export class UsersController {
    private logger = new InternalLogger(UsersController.name);

    constructor(private readonly usersService: UsersService) { }

    private formatResponse<T>(status: HttpStatus = HttpStatus.OK, response?: T) {
        return {
            status,
            ts: Math.floor(Date.now() / 1000),
            result: response,
        };
    }

    @ApiOperation({
        summary: 'Create a new user',
        description:
            'This endpoint creates a new user in the system based on the provided user data.',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description:
            'The user has been successfully created and the response contains the user details.',
        type: UserCreateResDTO,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid request data',
        type: UserErrorBadRequest,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Email already exists',
        type: UserCreateErrorConflict,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Access denied',
        type: UserErrorForbidden,
    })
    @Post()
    async createOne(@Body() body: UserCreateDTO, @Res() res: FastifyReply) {
        await this.usersService.createOne(body);
        return res.status(HttpStatus.CREATED).send(this.formatResponse());
    }

    @ApiOperation({
        summary: 'Get all users',
        description: 'This endpoint retrieves a list of all users in the system.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The users have been successfully retrieved.',
        type: UserGetAllResDTO,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Access denied',
        type: UserErrorForbidden,
    })
    @Get()
    async getAll(@Res() res: FastifyReply) {
        const users = await this.usersService.getAll();
        return res.status(HttpStatus.OK).send(this.formatResponse(HttpStatus.OK, users));
    }

    // @ApiOperation({
    //     summary: 'Get a user by ID',
    //     description: 'This endpoint retrieves a single user based on the provided user ID.',
    // })
    // @ApiResponse({
    //     status: HttpStatus.OK,
    //     description: 'The user has been successfully retrieved.',
    //     type: UserGetOneResDTO,
    // })
    // @ApiResponse({
    //     status: HttpStatus.NOT_FOUND,
    //     description: 'The user with the specified ID was not found.',
    //     type: UserErrorNotFoundDTO,
    // })
    // @ApiResponse({
    //     status: HttpStatus.FORBIDDEN,
    //     description: 'Access denied',
    //     type: UserErrorForbidden,
    // })
    // @ApiResponse({
    //     status: HttpStatus.BAD_REQUEST,
    //     description: 'Invalid request data',
    //     type: UserErrorBadRequest,
    // })

    @SwaggerController('UserGetOne')
    @Get(UsersEndpoitEnum.GET_ONE)
    async getOne(@Param() { id }: UserGetOneDTO, @Res() res: FastifyReply) {
        const user = await this.usersService.getOne(id);
        return res.status(HttpStatus.OK).send(this.formatResponse(HttpStatus.OK, user));
    }

    @ApiOperation({
        summary: 'Update a user by ID',
        description: 'This endpoint updates the information of a user with the specified ID.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The user information has been successfully updated.',
        type: UserUpdateResDTO,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'The user with the specified ID was not found.',
        type: UserErrorNotFoundDTO,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Access denied',
        type: UserErrorForbidden,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid request data',
        type: UserErrorBadRequest,
    })
    @Patch(UsersEndpoitEnum.UPDATE_ONE)
    async updateOne(
        @Param() { id }: UserGetOneDTO,
        @Body() body: UserUpdateDTO,
        @Res() res: FastifyReply,
    ) {
        await this.usersService.updateOne(id, body);
        return res.status(HttpStatus.OK).send(this.formatResponse(HttpStatus.OK));
    }

    @ApiOperation({
        summary: 'Delete a user by ID',
        description: 'This endpoint deletes a user with the specified ID from the system.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The user has been successfully deleted.',
        type: UserUpdateResDTO
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'The user with the specified ID was not found.',
        type: UserErrorNotFoundDTO
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Access denied',
        type: UserErrorForbidden,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid request data',
        type: UserErrorBadRequest,
    })
    @Delete(UsersEndpoitEnum.DELETE_ONE)
    async deleteOne(
        @Param() { id }: UserGetOneDTO,
        @Res() res: FastifyReply,
    ) {
        await this.usersService.deleteOne(id)
        return res.status(HttpStatus.OK).send(this.formatResponse(HttpStatus.OK));

    }
}
