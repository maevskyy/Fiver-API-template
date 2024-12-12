import {
    ArgumentsHost,
    Catch,
    ExceptionFilter as NestExceptionFilter,
    HttpException,
    HttpStatus,
    UnprocessableEntityException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { FastifyReply, FastifyRequest } from 'fastify';

import { InternalLogger } from '@/common';
import { IInternalError } from '@/common/types';

@Catch()
export class ExceptionFilter extends BaseExceptionFilter implements NestExceptionFilter {
    private readonly logger = new InternalLogger(ExceptionFilter.name);

    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();
        const { method, url, id } = ctx.getRequest<FastifyRequest>();

        let statusCode: number;
        let errorResponse: IInternalError;

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            const errorMessage = exception.getResponse();
            const getErrorMessage =
                typeof errorMessage === 'object' && 'message' in errorMessage
                    ? (errorMessage as any).message
                    : exception.message;

            switch ((errorMessage as any).error) {
                case 'Not Found':
                    errorResponse = {
                        errorCode: 'NOT_FOUND',
                        errorMessage: getErrorMessage,
                    };
                    break;
                case 'Bad Request':
                    errorResponse = {
                        errorCode: 'BAD_REQUEST',
                        errorMessage: 'Invalid request data',
                    };
                    break;

                default:
                    break;
            }
        } else {
            // Если это ошибка не HttpException, обрабатываем как внутреннюю серверную ошибку
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            errorResponse = {
                errorCode: 'INTERNAL_SERVER_ERROR',
                errorMessage: exception.message || 'Internal server error',
            };
        }

        // Логируем ошибку для внутреннего мониторинга
        // this.logger.error(
        //     exception,
        //     `[${method}] ${url} ${response.statusCode} ${id} message: ${errorResponse.errorMessage}`,
        // );

        return response.status(statusCode).send({
            statusCode,
            ts: Math.floor(Date.now() / 1000),
            result: errorResponse,
        });
    }
}
