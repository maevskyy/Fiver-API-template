import { IInternalError } from '@/common/types';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class UsersCommonoResDTO {
    @ApiProperty({
        example: 1709196361,
        description: 'Timestamp',
    })
    ts: number;
}

// common errros

export class UserErrorForbidden extends UsersCommonoResDTO {
    @ApiProperty({
        example: HttpStatus.FORBIDDEN,
        description: 'HTTP status code',
    })
    statusCode: number;

    @ApiProperty({
        example: {
            errorCode: 'FORBIDDEN',
            errorMessage: 'You do not have permission to perform this action',
        },
        description: 'Error details',
    })
    error: IInternalError;
}

export class UserErrorBadRequest extends UsersCommonoResDTO {
    @ApiProperty({
        example: HttpStatus.BAD_REQUEST,
        description: 'HTTP status code',
    })
    statusCode: number;

    @ApiProperty({
        example: {
            errorCode: 'BAD_REQUEST',
            errorMessage: 'Invalid request data',
        },
        description: 'Error details',
    })
    error: IInternalError;
}

export class UserErrorNotFoundDTO extends UsersCommonoResDTO {
    @ApiProperty({
        example: HttpStatus.NOT_FOUND,
        description: 'HTTP status code',
    })
    statusCode: number;

    @ApiProperty({
        example: {
            errorCode: 'USER_NOT_FOUND',
            errorMessage: 'The user with the specified ID was not found',
        },
        description: 'Error details',
    })
    error: IInternalError;
}
