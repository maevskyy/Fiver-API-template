import { InternalLogger } from '@/common/logger';
import { LoggerService } from '@nestjs/common';

export class PinoLogger implements LoggerService {
    private logger: InternalLogger = new InternalLogger('App');
    constructor(private context: string) {
        this.logger = context ? new InternalLogger(context) : new InternalLogger('App');
    }

    log(message: string) {
        this.logger.info(message);
    }

    error(message: string, trace: string) {
        this.logger.error({ message, stack: trace, name: this.context });
    }

    warn(message: string) {
        this.logger.warn(message);
    }

    debug(message: string) {
        this.logger.debug(message);
    }

    verbose(message: string) {
        this.logger.info(message);
    }
}
