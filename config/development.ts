import { IConfig } from "@/common";
import { config } from 'dotenv'

config({ path: '.env.local' })

export default {
    nodeEnv: process.env.NODE_ENV || 'development',
    app: {
        name: process.env.APP_NAME || 'user-service',
        port: Number.parseInt(process.env.APP_PORT || '3001', 10),
    },
    db: {
        postgres: {
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT,
            database: process.env.POSTGRES_DB,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD
        }
    },
    settings: {
        logFormat: process.env.LOG_FORMAT || "detailed",
        clientHosts: process.env.CLIENT_HOSTS
    }
} as IConfig