import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { UsersCommonoResDTO } from './common.dto';
import { HttpStatus } from '@nestjs/common';

export class UserUpdateDTO {
    @ApiProperty({
        type: String,
        required: false,
        example: 'John Doe',
        description: 'The user’s name.',
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        type: String,
        required: false,
        example: 'john.doe@example.com',
        description: 'The user’s email address. Must be a valid email format.',
    })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({
        type: String,
        required: false,
        example: 'securePassword123',
        description:
            'The user’s password. Must be at least 6 characters long, with a mix of letters and numbers.',
    })
    @IsString()
    @IsOptional()
    @MinLength(6, {
        message: 'Password must be at least 6 characters long',
    })
    password?: string;
}

export class UserUpdateResDTO extends UsersCommonoResDTO {
    @ApiProperty({
        example: HttpStatus.OK,
        description: 'HTTP status code',
    })
    statusCode: number;
}
