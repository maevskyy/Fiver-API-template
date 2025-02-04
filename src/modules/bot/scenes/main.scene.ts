import { Scene, SceneEnter, SceneLeave, Command, Ctx, On } from 'nestjs-telegraf';
import { IInternalContext } from '../types';
import { TelegramKeyboardService } from '../utils';
import { Injectable } from '@nestjs/common';
import { RedisService } from '@/modules/redis/redis.service';
import { ETelegramScenes } from '../types/enu';
import { ParserService } from '@/modules/parser/parser.service';
import { ERedisKeys } from '@/common/types';
import { CronService } from '@/modules/cron/cron.service';
import { InternalLogger } from '@/common';

@Injectable()
@Scene('MAIN_SCENE')
export class MainScene {
    private logger = new InternalLogger(MainScene.name);

    constructor(
        private readonly keyboardService: TelegramKeyboardService,
        private readonly redisService: RedisService,
        private readonly parserService: ParserService,
        private readonly cronService: CronService
    ) { }

    @SceneEnter()
    async onEnterScene(@Ctx() ctx: IInternalContext) {
        const sessionStatus = await this.redisService.get(`auth_${ctx.from.id}`);

        if (sessionStatus !== 'authenticated') {
            await ctx.reply('Вы не авторизованы. Пожалуйста, авторизуйтесь.');
            await ctx.scene.leave();
            return;
        }

        const appStatus = await this.redisService.get(ERedisKeys.GLOBAL_APP_STATUS) || 'deactivated';
        const buttonLabel = appStatus === 'started' ? 'Стоп ❌' : 'Старт 🚀';

        await ctx.reply('Вы в меню:', this.getMainMenuKeyboard(buttonLabel));
    }

    private getMainMenuKeyboard(buttonLabel: string) {
        return this.keyboardService.createKeyboard([
            [buttonLabel, 'Конфигурация ⚙️'],
            ['Проголосовать за порошенко 💥', 'Нет, за зеленского 🤡'],
            ['запустить орешник 🌰'],
            ['Статистика 📊', 'Выйти 👋']
        ]);
    }

    private handlers = {
        'db': async (ctx: IInternalContext) => {
            const data = await this.parserService.getTokensData();
            console.log(data.tokensAdderss);
            await ctx.reply('Done');
        },
        'Проголосовать за порошенко 💥': async (ctx: IInternalContext) => {
            await ctx.reply('Плюсы: вкусный шоколад \n\nМинусы:не всегда вкусный шоколад');
        },
        'Нет, за зеленского 🤡': async (ctx: IInternalContext) => {
            await ctx.reply('Плюсы: смешной \n\nМинусы: война');
        },
        'запустить орешник 🌰': async (ctx: IInternalContext) => {
            await ctx.reply('Сам придумай себе прикол, клоун');
        },
        'Выйти 👋': async (ctx: IInternalContext) => {
            await this.redisService.del(`auth_${ctx.from.id}`);
            ctx.session = {};
            await ctx.reply('Вы успешно вышли из системы.', { reply_markup: { remove_keyboard: true } });
            await ctx.scene.leave();
        },
        'Конфигурация ⚙️': async (ctx: IInternalContext) => {
            await ctx.scene.enter(ETelegramScenes.CONFIG);
        },
        'Статистика 📊': async (ctx: IInternalContext) => {
            await ctx.reply('Пока нету ниче');
        },
        'Старт 🚀': async (ctx: IInternalContext) => this.toggleAppStatus(ctx, 'started'),
        'Стоп ❌': async (ctx: IInternalContext) => this.toggleAppStatus(ctx, 'deactivated')
    };

    @On('text')
    async onTextButton(@Ctx() ctx: IInternalContext) {
        const handler = this.handlers[ctx.text];
        if (handler) {
            await handler(ctx);
        } else {
            await ctx.reply('Неизвестная команда');
        }
    }

    private async toggleAppStatus(ctx: IInternalContext, status: string) {
        const currentStatus = await this.redisService.get(ERedisKeys.GLOBAL_APP_STATUS) || 'deactivated';
        if (status === 'started' && currentStatus !== 'started') {
            await this.redisService.set(ERedisKeys.GLOBAL_APP_STATUS, 'started');
            this.logger.info('Restarting cron job...');
            await this.cronService.createCronJob()
            await ctx.reply('Приложение перезапущено и работает!', { reply_markup: { remove_keyboard: true } });
        } else if (status === 'deactivated' && currentStatus === 'started') {
            await this.redisService.set(ERedisKeys.GLOBAL_APP_STATUS, 'deactivated');
            await this.cronService.stopCronJob()
            await ctx.reply('Приложение остановлено!', { reply_markup: { remove_keyboard: true } });
        }

        const updatedStatus = await this.redisService.get(ERedisKeys.GLOBAL_APP_STATUS);
        const buttonLabel = updatedStatus === 'started' ? 'Стоп ❌' : 'Старт 🚀';
        await ctx.reply('Вы в меню:', this.getMainMenuKeyboard(buttonLabel));
    }

    @Command('exit')
    async onExitCommand(@Ctx() ctx: IInternalContext) {
        await ctx.scene.leave();
        await ctx.reply('Вы вышли из MAIN_SCENE сцены.');
    }

    @SceneLeave()
    async onLeaveScene(@Ctx() ctx: IInternalContext) {
        // Логика на выход из сцены, если потребуется
    }
}
