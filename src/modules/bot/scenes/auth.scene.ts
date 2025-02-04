import { Scene, SceneEnter, SceneLeave, Command, Ctx, On } from 'nestjs-telegraf';
import { IInternalContext } from '../types';
import { TelegramKeyboardService } from '../utils';
import { Injectable } from '@nestjs/common';
import { ETelegramScenes } from '../types/enu';
import { RedisService } from '@/modules/redis/redis.service';
import { DbService } from '@/modules/db/db.service';

@Injectable()
@Scene('AUTH_SCENE')
export class AuthScene {
    constructor(
        private readonly keyboardService: TelegramKeyboardService,
        private readonly redisService: RedisService,
        private readonly dbService: DbService
    ) { }

    @SceneEnter()
    async onEnterScene(@Ctx() ctx: IInternalContext) {
        const isAuthenticated = await this.redisService.get(`auth_${ctx.from.id}`);
        if (isAuthenticated) {
            await ctx.reply('Вы уже авторизованы. Перенаправляем в главное меню...');
            await ctx.scene.enter(ETelegramScenes.MAIN);
        } else {
            ctx.session.__scenes.authData = {};
            await ctx.reply('Здравствуйте! Пожалуйста, введите ваш логин:');
        }
    }

    @On('text')
    async onLoginInput(@Ctx() ctx: IInternalContext) {
        if (!ctx.session.__scenes.authData.login) {
            ctx.session.__scenes.authData.login = ctx.text;
            await ctx.reply('Спасибо! Теперь введите ваш пароль:');
        } else if (!ctx.session.__scenes.authData.password) {
            ctx.session.__scenes.authData.password = ctx.text;
            await this.validateCredentials(ctx);
        }
    }

    private async validateCredentials(@Ctx() ctx: IInternalContext) {
        const { login, password } = ctx.session.__scenes.authData;
        const getUserFromDb = await this.dbService.authTGUser(login)
        if (!getUserFromDb) {
            await ctx.reply('Неверный логин или пароль. Попробуйте еще раз.');
            ctx.session.__scenes.authData = {};
            await ctx.scene.reenter();
        }
        else {
            if (getUserFromDb.password === password) {
                await ctx.reply('Аутентификация успешна! Добро пожаловать.');

                await this.redisService.set(`auth_${ctx.from.id}`, 'authenticated', 3600);

                await ctx.scene.leave();
                await ctx.scene.enter(ETelegramScenes.MAIN);
            } else {
                await ctx.reply('Неверный логин или пароль. Попробуйте еще раз.');
                ctx.session.__scenes.authData = {};
                await ctx.scene.reenter();
            }
        }
    }

    // Команда для выхода из сцены
    @Command('exit')
    async onExitCommand(@Ctx() ctx: IInternalContext) {
        await ctx.scene.leave();
        await ctx.reply('Вы вышли из AUTH_SCENE сцены.');
    }

    // Обработчик на выход из сцены
    @SceneLeave()
    async onLeaveScene(@Ctx() ctx: IInternalContext) {
        // await ctx.reply('Вы покинули AUTH_SCENE.');
    }
}
