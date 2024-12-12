import { Logger as PinoLogger, pino } from 'pino';
import pretty from 'pino-pretty';

import { internalConfig } from '../config';

const stream = pretty({
    colorize: true,
    ignore: 'pid,hostname',
    levelFirst: true,
    translateTime: 'mm/dd HH:MM:ss o',
    singleLine: true,
    customPrettifiers: {
        caller: (caller) => `${caller}`,
    },
});

export const pinoForLogger: PinoLogger = pino(
    {
        enabled: internalConfig.nodeEnv !== 'test',
        serializers: {
            err: (e) => ({
                type: e.type,
                message: e.message,
                stack: e.stack,
            }),
        },
    },
    stream,
);

export class InternalLogger {
    private _logger: pino.Logger;
    private _appName: string = internalConfig.app.name;
    private _key: string;

    constructor(key: string) {
        this._logger = pinoForLogger;
        this._key = key;
        this._appName;
    }

    warn(message: string, ...args: any[]) {
        return this._logger.warn(args, `[${this._appName}](${this._key}) ${message}`);
    }

    debug(message: string, ...args: any[]) {
        return this._logger.debug(args, `[${this._appName}](${this._key}) ${message}`);
    }

    info(message: string, ...args: any[]) {
        return this._logger.info(args, `[${this._appName}](${this._key}) ${message}`);
    }

    error(err: Error | string, message?: any) {
        return this._logger.error({ err }, `[${this._appName}](${this._key}) ${message}`);
    }
}
