import { Module } from '@nestjs/common';
import * as Modules from '@/modules';
import { PinoLogger } from './logger';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { ExceptionFilter } from './filters/exception.filter';

const imports = [...Object.values(Modules)];

let controllers;
const providers = [
    {
        provide: 'APP_LOGGER',
        useClass: PinoLogger,
    },
    // {
    //     provide: APP_INTERCEPTOR,
    //     useClass: LoggerInterceptor,
    // },
    {
        provide: APP_FILTER,
        useClass: ExceptionFilter,
    },
];

@Module({
    imports,
    controllers,
    providers,
})
export class AppModule {}
