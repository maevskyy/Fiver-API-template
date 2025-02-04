import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { internalConfig } from '@/common';
import { BotUpdate } from './bot.update';
import * as scenes from './scenes'
import * as utils from './utils'
import { RedisService } from '../redis/redis.service';
import { ParserService } from '../parser/parser.service';
import { DbService } from '../db/db.service';
import { CronModule } from '../cron/cron.module';
import { RedisModule } from '../redis';


const imports = [
  TelegrafModule.forRoot({
    middlewares: [session()],
    token: internalConfig.telegram.token,
  }),
  CronModule,
  RedisModule
]

const providerUtils = Object.values(utils)
const providerScenes = Object.values(scenes)
const providers = [ParserService, DbService, BotUpdate, BotService, ...providerScenes, ...providerUtils]

@Module({
  imports,
  providers
})
export class BotModule { }
