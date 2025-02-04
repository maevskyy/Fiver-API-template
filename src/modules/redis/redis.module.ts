import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global()
@Module({
  // providers: [{ provide: 'REDIS_CLIENT', useClass: RedisService }],
  // exports: ['REDIS_CLIENT', RedisService],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule { }
