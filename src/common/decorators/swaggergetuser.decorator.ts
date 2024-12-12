import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserGetOneResDTO, UserErrorNotFoundDTO, UserErrorForbidden, UserErrorBadRequest } from '@/modules/api/users/dto'; // Импортируй свои DTO

export function SwaggerGetUser() {
    return applyDecorators(
        ApiOperation({
            summary: 'Get a user by ID',
            description: 'This endpoint retrieves a single user based on the provided user ID.',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'The user has been successfully retrieved.',
            type: UserGetOneResDTO,
        }),
        ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: 'The user with the specified ID was not found.',
            type: UserErrorNotFoundDTO,
        }),
        ApiResponse({
            status: HttpStatus.FORBIDDEN,
            description: 'Access denied',
            type: UserErrorForbidden,
        }),
        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            description: 'Invalid request data',
            type: UserErrorBadRequest,
        }),
    );
}
