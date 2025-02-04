// src/modules/cron/cron.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { CronJob } from 'cron';
import { RedisService } from '../redis/redis.service';
import { ParserService } from '../parser/parser.service';
import { ERedisKeys } from '@/common/types';
import { InternalLogger } from '@/common';
import { DbService } from '../db/db.service';

@Injectable()
export class CronService implements OnModuleInit {
    private cronJobs: Map<string, CronJob> = new Map()
    private logger = new InternalLogger(CronService.name)

    constructor(
        private readonly redisService: RedisService,
        private readonly parserService: ParserService,
        private readonly dbService: DbService
    ) { }

    async onModuleInit() {
        const appStatus = await this.redisService.get(ERedisKeys.GLOBAL_APP_STATUS);
        this.logger.info(`AppStatus: ${appStatus}`)
        await this.createCronJob();
    }

    private getRandomInterval(intervalInMinutes: string) {
        const randomSeconds = Math.floor(Math.random() * 59) + 1;
        return `${randomSeconds} */${intervalInMinutes} * * * *`;
    }



    private async functionToExecute() {
        this.logger.info('Function in cron executing..')
        const tokens = await this.parserService.getTokensData()
        const formattedTokens =
            tokens.tokenFullInfo.map(el => ({
                pair_address: el.pair.pairAddress ?? '',
                bt_address: el.pair.baseToken.address ?? '',
                bt_name: el.pair.baseToken.name ?? '',
                liquidity_usd: String(el.pair.liquidity.usd) ?? '',
                market_cap: String(el.pair.marketCap) ?? '',
                pair_created_at: new Date(el.pair.pairCreatedAt),
                price_change: el.pair.priceChange
            }))
        await this.dbService.upsertTokens(formattedTokens)


    }

    async createCronJob(id: string = 'test') {
        const appStatus = await this.redisService.get(ERedisKeys.GLOBAL_APP_STATUS);
        const timer = await this.redisService.get(ERedisKeys.GLOBAL_TIMER);
        if (appStatus === 'started' && timer) {
            // const cronExpression = this.getRandomInterval(timer);  // Каждые х минут + рандомные секунды
            const cronExpression = `*/${timer} * * * *`;  // Каждые минут
            // const cronExpression = `*/${timer} * * * * *`;  // Каждые секунд
            const job = new CronJob(cronExpression, async () => {
                this.functionToExecute()
            })
            this.cronJobs.set(id, job)
            job.start()
        }
    }

    async stopCronJob(id: string = 'test') {
        const job = this.cronJobs.get(id)
        if (job) {
            job.stop()
            this.cronJobs.delete(id)
        }
    }
}
