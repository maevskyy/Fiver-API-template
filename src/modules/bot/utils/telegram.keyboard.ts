import { Injectable } from '@nestjs/common';
import { Markup } from 'telegraf';
import { InlineKeyboardMarkup, ReplyKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class TelegramKeyboardService {

    createInlineKeyboard(buttons: [string, string][]): Markup.Markup<InlineKeyboardMarkup> {
        const inlineButtons = buttons.map(([text, callbackData]) =>
            Markup.button.callback(text, callbackData)
        );
        return Markup.inlineKeyboard(inlineButtons);
    }

    createKeyboard(buttons: string[][], oneTime = false): Markup.Markup<ReplyKeyboardMarkup> {
        const keyboardButtons = buttons.map(row =>
            row.map(text => Markup.button.text(text))
        );
        return Markup.keyboard(keyboardButtons).oneTime(oneTime).resize();
    }
}
