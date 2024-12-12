import { SwaggerGetUser } from './swaggergetuser.decorator';

export function SwaggerController(controllerName: string) {
    switch (controllerName) {
        case 'UserGetOne':
            return SwaggerGetUser(); // Здесь можно подключать другие декораторы в зависимости от контроллера
        // Добавь другие кейсы для других контроллеров
        default:
            return;
    }
}
