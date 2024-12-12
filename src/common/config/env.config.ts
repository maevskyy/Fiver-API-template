import nodeConfig from 'config';

interface IPostgresSQLEnvs {
    port: string;
    host: string;
    database: string;
    username: string;
    password: string;
}

export interface IConfig {
    nodeEnv: string;
    app: {
        port: number;
        name: string;
    };
    db: {
        postgres: IPostgresSQLEnvs;
    };
    settings: {
        logFormat: string;
        clientHosts: string

    }
}

export const internalConfig: IConfig = {
    nodeEnv: nodeConfig.get('nodeEnv'),
    app: nodeConfig.get('app'),
    db: nodeConfig.get('db'),
    settings: nodeConfig.get('settings')
};
