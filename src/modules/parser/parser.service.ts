import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import axios from 'axios';
import path from 'path';
import { InternalLogger } from '@/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ParserService {
    private logger = new InternalLogger(ParserService.name)

    constructor(private readonly redisService: RedisService) { }

    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async execPyScript(url: string): Promise<string[]> {
        try {
            await this.delay(3000);
            const scriptPath = path.resolve('scripts/scraper.py');

            return new Promise((resolve, reject) => {
                exec(`python "${scriptPath}" "${url}"`, (error, stdout, stderr) => {
                    if (error) {
                        reject(`Execution error: ${error}`);
                        return;
                    }
                    if (stderr) {
                        reject(`Error stderr: ${stderr}`);
                        return;
                    }

                    try {
                        const urls = JSON.parse(stdout);
                        const tokens = urls.map(url => url.split('/')[4]);
                        resolve(tokens);
                    } catch (parseError) {
                        reject("Parsing data error");
                    }
                });
            });
        } catch (err) {
            this.logger.error('Error while executing scrit: ' + err);
            throw err;
        }
    }

    private async getTokenReq(token: string, chain = 'solana') {
        try {
            const response = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/${chain}/${token}`);
            return response.data;
        } catch (error) {
            this.logger.error('Error fetching token data:', error);
        }
    }

    public async getTokensData() {
        const link = await this.redisService.get('config_global_link') ?? '';
        const tokens = await this.execPyScript(link);

        // Нормализация токенов и удаление лишних пробелов или символов
        const normalizedTokens = tokens
            .map(token => token.trim().toLowerCase())  // убираем пробелы и приводим к нижнему регистру
            .filter((value, index, self) => self.indexOf(value) === index);  // отфильтровываем повторяющиеся значения сразу после нормализации

        // Получаем уникальные оригинальные токены на основе нормализованных значений
        const uniqueOriginalTokens = normalizedTokens.map(normalizedToken => {
            return tokens.find(token => token.trim().toLowerCase() === normalizedToken);
        });

        // Запрашиваем данные о токенах
        const tokenData = await Promise.all(uniqueOriginalTokens.map(token => this.getTokenReq(token)));


        const uniqueTokenPairs = () => {
            let result = []
            let tokenAddresses = []
            const data = tokenData.map(el => el.pair)

            data.forEach((el) => {
                const token = el.baseToken.address
                if (!tokenAddresses.includes(token)) {
                    result.push(el) // Добавляем объект, если токен уникальный
                    tokenAddresses.push(token) // Добавляем адрес токена в список уникальных
                }
            })

            return result
        }


        // Формируем список уникальных адресов токенов
        const tokenAdderssList = uniqueTokenPairs().map(token => token.baseToken.address);

        return {
            tokensAdderss: tokenAdderssList,
            tokenFullInfo: tokenData
        };
    }

}
