import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UsersCommonoResDTO } from './common.dto';
import { HttpStatus } from '@nestjs/common';
import { IDBUser } from '@/common/types';
import { mockUsers } from '../../../db/mockdb/users.mock';

export class UserGetOneDTO {
    @ApiProperty({
        type: String,
        required: true,
        example: '1',
        description: 'The user unique id',
    })
    @IsString()
    @IsNotEmpty()
    id: string;
}

export class UserGetOneResDTO extends UsersCommonoResDTO {
    @ApiProperty({
        example: HttpStatus.OK,
        description: 'HTTP status code',
    })
    statusCode: number;

    @ApiProperty({
        example: mockUsers[0],
        description: 'User data',
    })
    result: IDBUser;
}
