import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsArray, MinLength } from 'class-validator';
import { UsersCommonoResDTO } from './common.dto';
import { HttpStatus } from '@nestjs/common';
import { IInternalError } from '@/common/types';

export class UserCreateDTO {
    @ApiProperty({
        type: String,
        required: true,
        example: 'John Doe',
        description: 'The user’s name. Must be a non-empty string.',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        type: String,
        required: true,
        example: 'john.doe@example.com',
        description: 'The user’s email address. Must be a valid email format.',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        type: String,
        required: true,
        example: 'securePassword123',
        description:
            'The user’s password. Must be at least 6 characters long, with a mix of letters and numbers.',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6, {
        message: 'Password must be at least 6 characters long',
    })
    password: string;
}

export class UserCreateResDTO extends UsersCommonoResDTO {
    @ApiProperty({
        example: HttpStatus.CREATED,
        description: 'HTTP status code',
    })
    statusCode: number;
}
export class UserCreateErrorConflict extends UsersCommonoResDTO {
    @ApiProperty({
        example: HttpStatus.CONFLICT,
        description: 'HTTP status code',
    })
    statusCode: number;

    @ApiProperty({
        example: {
            errorCode: 'CONFLICT',
            errorMessage: 'Email already exists',
        },
        description: 'Error details',
    })
    error: IInternalError;
}
