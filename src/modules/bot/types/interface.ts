import { Context as TelegrafContext } from 'telegraf';
import { Scenes, } from 'telegraf';
import { CallbackQuery } from 'telegraf/typings/core/types/typegram';

export interface MyWizardSession extends Scenes.WizardSessionData {
    gender?: string;
    cursor: number;
    authData: any;
    waitingForLink: boolean;
    waitingForTimer: boolean
}

export interface IInternalContext extends TelegrafContext {
    scene: Scenes.SceneContextScene<IInternalContext, MyWizardSession>; // Управление сценой и сессией
    wizard: Scenes.WizardContextWizard<IInternalContext>;  // Поддержка Wizard-сцены
    session: Scenes.WizardSession<MyWizardSession>;  // Сессия с данными Wizard-сцены
    callbackQuery: CallbackQuery.DataQuery;  // Данные callbackQuery для inline-кнопок
}




// export interface IInternalContext extends Scenes.WizardContext<MySessionData> { }