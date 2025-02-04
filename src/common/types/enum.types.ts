export enum ApiPathEnum {
    USERS = 'Users'
}

export enum UsersEndpoitEnum {
    GET_ONE = ':id',
    UPDATE_ONE = 'id',
    DELETE_ONE = ':id'
}   

export enum ERedisKeys {
    GLOBAL_APP_STATUS = 'app_status',
    GLOBAL_LINK = 'config_global_link',
    GLOBAL_TIMER = 'config_global_timer'
}