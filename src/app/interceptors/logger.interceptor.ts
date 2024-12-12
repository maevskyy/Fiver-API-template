import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { internalConfig, InternalLogger } from '@/common';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    private readonly logger = new InternalLogger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const startTime = performance.now();
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<FastifyRequest | any>();
        const response = ctx.getResponse<FastifyReply>();

        const { method, url, id } = request;
        const requestBody = request.body;
        const requestQuery = request.query;
        const requestParams = request.params;
        const requestHeaders = {
            host: request.headers.host,
            'user-agent': request.headers['user-agent'],
        };

        const originalSend = response.send;
        let responseData: any;
        response.send = (payload: any) => {
            responseData = payload;
            return originalSend.call(response, payload);
        };

        // Проверка на технический запрос (metrics, health)
        const isTechRequest = url.includes('metrics') || url.includes('health');

        // Определяем формат лога в зависимости от окружения
        const logFormat = internalConfig.settings.logFormat || 'detailed'; // 'detailed' или 'compact'

        return next.handle().pipe(
            tap(() => {
                const responseTime = (performance.now() - startTime) / 1000;
                const statusCode = response.statusCode;

                if (!isTechRequest) {
                    if (logFormat === 'detailed') {
                        const logMessage = `
------------------------
Request:
------------------------
  Method    : ${method}
  URL       : ${url}
  Request ID: ${id}

  Query     : ${JSON.stringify(requestQuery, null, 2)}
  Params    : ${JSON.stringify(requestParams, null, 2)}
  Body      : ${JSON.stringify(requestBody, null, 2)}
  Headers   : ${JSON.stringify(requestHeaders, null, 2)}

------------------------
Response:
------------------------
  Status Code    : ${statusCode}
  Response Time  : ${responseTime}ms
  Data           : ${JSON.stringify(responseData, null, 2)}
------------------------
                    `;
                        this.logger.info(logMessage);
                    } else {
                        const compactLogMessage = `[${method}] ${url} - Status: ${statusCode} - Time: ${responseTime}ms - Response: ${JSON.stringify(responseData)} - Query: ${JSON.stringify(requestQuery)} - Params: ${JSON.stringify(requestParams)} - Body: ${JSON.stringify(requestBody)}`;
                        this.logger.info(compactLogMessage);
                    }
                }
            }),
        );
    }
}
