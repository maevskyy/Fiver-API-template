import { Injectable } from '@nestjs/common';
import { UserCreateDTO } from './dto';
import { UserUpdateDTO } from './dto/updateUser.dto';
import { DbService } from '@/modules/db/db.service';

@Injectable()
export class UsersService {

    constructor(private readonly dbService: DbService) { }

    async createOne(userData: UserCreateDTO) {
        return this.dbService.createUser(userData)
    }

    async getAll() {
        return this.dbService.getAllUsers()
    }

    async getOne(userId: string) {
        return this.dbService.getOneUser(userId)
    }

    async updateOne(userId: string, dataToUpdate: UserUpdateDTO) {
        return this.dbService.updateUser(userId, dataToUpdate)
    }

    async deleteOne(userId: string) {
        return this.dbService.deleteUser(userId)
    }

}
