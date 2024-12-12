import { InternalLogger } from '@/common/logger';
import { IDBUser } from '@/common/types';
import { Injectable } from '@nestjs/common';
import { mockUsers } from './mockdb/users.mock';
import { UserCreateDTO, UserUpdateDTO } from '../api/users/dto';
import * as uuid from 'uuid'

@Injectable()
export class DbService {
    private readonly logger = new InternalLogger(DbService.name);
    private usersData: IDBUser[] = mockUsers;

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

}
