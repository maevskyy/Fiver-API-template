import { Module } from '@nestjs/common';
import { ParserService } from './parser.service';
import { RedisService } from '../redis/redis.service';

@Module({
  providers: [ParserService, RedisService]
})
export class ParserModule { }
