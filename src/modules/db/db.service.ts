import { InternalLogger } from '@/common/logger';
import { IDBUser } from '@/common/types';
import { HttpException, Injectable } from '@nestjs/common';
import { mockUsers } from './mockdb/users.mock';
import { UserCreateDTO, UserUpdateDTO } from '../api/users/dto';
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import * as uuid from 'uuid'
import { internalConfig } from '@/common';

@Injectable()
export class DbService {
    private readonly logger = new InternalLogger(DbService.name);
    private usersData: IDBUser[] = mockUsers;
    private client: SupabaseClient

    constructor() {
        const { url, key } = internalConfig.db.supabase
        this.client = createClient(url, key)
    }


    async authTGUser(name: string): Promise<IDBUser | null> {
        try {
            const { data, error } = await this.client
                .from('bot_users')
                .select('*')
                .eq('login', name)
                .single()

            if (error) {
                this.logger.error('Error in authTGUser', error);
            }

            return data
        } catch (error) {
            this.logger.error('Error in authTGUser', error);
            return null
        }
    }

    async createUser(userData: UserCreateDTO) {
        try {
            const dbUser: IDBUser = {
                ...userData,
                id: uuid.v4(),
            };

            this.usersData.push(dbUser);
            return dbUser
        } catch (error) {
            this.logger.error('Error creating user:', error);
            return null
        }

    }

    async getAllUsers() {
        try {
            return this.usersData
        } catch (error) {
            this.logger.error('Error fetching all users:', error);
            return null
        }
    }

    async getOneUser(userId: string) {
        try {
            return this.usersData.filter((user) => user.id === userId);
        } catch (error) {
            this.logger.error('Error fetching user by ID:', error);
            return null
        }
    }

    async updateUser(userId: string, dataToUpdate: UserUpdateDTO) {
        try {
            let updatedUser: IDBUser | undefined;

            this.usersData = this.usersData.map((user) => {
                if (user.id === userId) {
                    updatedUser = { ...user, ...dataToUpdate };
                    return updatedUser;
                }
                return user;
            });

            return updatedUser;
        } catch (error) {
            this.logger.error('Error updating user:', error);
            return null;
        }

    }

    async deleteUser(userId: string) {
        try {
            this.usersData = this.usersData.filter((user) => user.id !== userId);
            return true
        } catch (error) {
            this.logger.error('Error deleting user:', error);
            return false
        }
    }


    async upsertTokens(tokens: any) {
        console.log(tokens, 'this is tokens');

        try {
            // Фильтруем уникальные токены по полю bt_address
            const uniqueTokens = tokens.reduce((acc: any[], token: any) => {
                // Проверяем, существует ли уже такой bt_address в аккумуляторе
                if (!acc.some((t) => t.bt_address === token.bt_address)) {
                    acc.push(token);
                }
                return acc;
            }, []);

            console.log(uniqueTokens, 'filtered unique tokens');

            const { data, error } = await this.client
                .from('parsed_tokens')
                .upsert(uniqueTokens, { onConflict: 'bt_address' })
                .select();

            if (error) {
                this.logger.error('Error upserting tokens:', error);
            } else {
                this.logger.info('Tokens upserted:', data);
            }
        } catch (error) {
            this.logger.error('Error upsertTokens users:', error);
            return null;
        }
    }

}
