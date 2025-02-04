import { Scene, SceneEnter, SceneLeave, Command, Ctx, On } from 'nestjs-telegraf';
import { IInternalContext } from '../types';
import { TelegramKeyboardService } from '../utils';
import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from '@/modules/redis/redis.service';
import { ETelegramScenes } from '../types/enu';
import { CronService } from '@/modules/cron/cron.service';

@Injectable()
@Scene('CONFIG_SCENE')
export class ConfigScene {
    constructor(
        private readonly keyboardService: TelegramKeyboardService,
        private readonly redisService: RedisService,
        private readonly cronService: CronService
    ) { }

    private async getConfig() {
        const link = await this.redisService.get('config_global_link');
        const timer = await this.redisService.get('config_global_timer');

        const text = `Текущая конфигурация: \n\nСсылка: ${link ?? 'http://default.com'} \n\nТаймер: ${timer ?? 'null'} минут`;
        return {
            link,
            timer,
            text
        }
    }

    @SceneEnter()
    async onEnterScene(@Ctx() ctx: IInternalContext) {
        const sessionStatus = await this.redisService.get(`auth_${ctx.from.id}`);

        if (sessionStatus !== 'authenticated') {
            await ctx.reply('Вы не авторизованы. Пожалуйста, авторизуйтесь.');
            await ctx.scene.leave();
        } else {
            const config = await this.getConfig()
            await ctx.reply(config.text, this.keyboardService.createKeyboard([['Изменить ссылку 🔗', 'Изменить таймер ⏰'], ['Назад ◀️']]));
        }
    }

    @On('text')
    async onTextInput(@Ctx() ctx: IInternalContext) {
        if (ctx.text === 'Изменить ссылку 🔗') {
            await ctx.reply('Введите новую ссылку:');
            ctx.session.__scenes.waitingForLink = true;
        } else if (ctx.text === 'Изменить таймер ⏰') {
            await ctx.reply('Введите новый таймер в минутах:');
            ctx.session.__scenes.waitingForTimer = true;
        } else if (ctx.session.__scenes.waitingForLink) {
            await this.redisService.set('config_global_link', ctx.text);
            const config = await this.getConfig()
            await ctx.reply(config.text);
            ctx.session.__scenes.waitingForLink = false;
        } else if (ctx.session.__scenes.waitingForTimer) {
            const timer = parseInt(ctx.text);
            if (isNaN(timer) || timer <= 0) {
                await ctx.reply('Пожалуйста, введите корректное число минут.');
            } else {
                await this.redisService.set('config_global_timer', ctx.text);
                const config = await this.getConfig()
                await ctx.reply(config.text);
                ctx.session.__scenes.waitingForTimer = false;
            }
        } else if (ctx.text === 'Назад ◀️') {
            await ctx.scene.enter(ETelegramScenes.MAIN);
        }
        else {
            await ctx.reply('Шо?')
        }
    }

    @Command('exit')
    async onExitCommand(@Ctx() ctx: IInternalContext) {
        await ctx.scene.leave();
        await ctx.reply('Вы вышли из CONFIG_SCENE сцены.');
    }

    @SceneLeave()
    async onLeaveScene(@Ctx() ctx: IInternalContext) {
    }
}
