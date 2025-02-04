import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { internalConfig, InternalLogger } from '@/common';


@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;
    private logger = new InternalLogger(RedisService.name);
    public isConnected = false;

    constructor() {
        this.client = new Redis({
            host: internalConfig.db.redis.host,
            port: internalConfig.db.redis.port,
            password: internalConfig.db.redis.password,
            username: internalConfig.db.redis.user,
            db: internalConfig.db.redis.database,
        });

        this.initEvents();
    }

    private initEvents() {
        this.client.on('connect', () => {
            this.isConnected = true;
            this.logger.info('Connected to Redis');
        });

        this.client.on('error', (err) => {
            this.isConnected = false;
            this.logger.error('Error with Redis connection', err);
        });

        this.client.on('reconnecting', () => {
            this.logger.info('Reconnecting to Redis...');
        });

        this.client.on('close', () => {
            this.isConnected = false;
            this.logger.info('Redis connection closed');
        });
    }

    async onModuleInit() {
        try {
            // if (this.client.status !== 'connecting' && this.client.status !== 'connect') {
            //     await this.client.connect();
            // }
            if (!this.client) {
                await this.client.connect();
            }
        } catch (err) {
            throw new Error(`Redis Connection Error: ${err}`);
        }
    }

    async onModuleDestroy() {
        await this.client.quit();
    }

    async get(key: string): Promise<string | null> {
        try {
            return await this.client.get(key);
        } catch (error) {
            throw new Error(`Redis Get Error: ${error}`);

        }
    }

    async set(key: string, value: string, ttl?: number): Promise<void> {
        console.log(this.client.status)
        try {
            console.log('Attempting to set key in Redis');
            if (ttl) {
                await this.client.setex(key, ttl, value);
            } else {
                const reponse = await this.client.set(key, value);
                console.log(reponse, 'this is reponse')
            }
            console.log('Redis set successful');
        } catch (error) {
            console.error('Redis set failed', error);
        }
    }

    async del(key: string): Promise<number> {
        const result = await this.client.del(key);
        this.logger.info(`Deleted key: ${key}`);
        return result;
    }
}
