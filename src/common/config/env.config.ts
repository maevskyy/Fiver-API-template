import nodeConfig from 'config';

interface IPostgresSQLEnvs {
    port: string;
    host: string;
    database: string;
    username: string;
    password: string;
}

interface ITelegramEnvs {
    token: string
}

interface IRedisDbEnvs {
    host: string;
    port: number;
    user: string;
    password: string;
    database: number;
    sharedDatabase: number;
};

interface ISupabaseDBEnvs {
    key: string;
    url: string
}



export interface IConfig {
    nodeEnv: string;
    app: {
        port: number;
        name: string;
    };
    db: {
        postgres: IPostgresSQLEnvs;
        redis: IRedisDbEnvs;
        supabase: ISupabaseDBEnvs;
    };
    settings: {
        logFormat: string;
        clientHosts: string

    },
    telegram: ITelegramEnvs
}

export const internalConfig: IConfig = {
    nodeEnv: nodeConfig.get('nodeEnv'),
    app: nodeConfig.get('app'),
    db: nodeConfig.get('db'),
    settings: nodeConfig.get('settings'),
    telegram: nodeConfig.get('telegram')

};
