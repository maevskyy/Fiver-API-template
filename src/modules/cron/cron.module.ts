import { Global, Module } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { ParserService } from '../parser/parser.service';
import { RedisModule } from '../redis';
import { DbService } from '../db/db.service';

@Global()
@Module({
    imports: [ScheduleModule.forRoot(), RedisModule],
    providers: [CronService, ParserService, DbService],
    exports: [CronService],
})
export class CronModule { }
