import { InternalLogger } from "@/common";
import { InjectBot, On, Start, Update } from "nestjs-telegraf";
import { Context, Telegraf } from "telegraf";
import { IInternalContext } from "./types";
import { ETelegramScenes } from "./types/enu";
import { TelegramKeyboardService } from "./utils";
import { RedisService } from "../redis/redis.service";

@Update()
export class BotUpdate {
    private readonly logger = new InternalLogger(BotUpdate.name);

    constructor(
        @InjectBot() private readonly bot: Telegraf<IInternalContext>,
        private readonly telegramKeyboards: TelegramKeyboardService,
        private readonly redisService: RedisService,
    ) {
        this.logger.info('Telegram started');
    }

    @Start()
    async startHandler(ctx: IInternalContext) {
        const sessionStatus = await this.redisService.get(`auth_${ctx.from.id}`);

        if (sessionStatus === 'authenticated') {
            await ctx.scene.enter(ETelegramScenes.MAIN);
        } else {
            await ctx.scene.enter(ETelegramScenes.AUTH);
        }
    }

    @On('text')
    async handleSetParameters(ctx: IInternalContext) {
        const sessionStatus = await this.redisService.get(`auth_${ctx.from.id}`);

        if (sessionStatus === 'authenticated') {
            await ctx.reply('Вы успешно авторизованы! Давайте продолжим.');
            await ctx.scene.enter(ETelegramScenes.MAIN);
        } else {
            await ctx.reply('Пожалуйста, пройдите авторизацию.');
            await ctx.scene.enter(ETelegramScenes.AUTH);
        }
    }
}
