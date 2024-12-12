import { ApiProperty } from '@nestjs/swagger';
import { UsersCommonoResDTO } from './common.dto';
import { mockUsers } from '../../../db/mockdb/users.mock';
import { IDBUser } from '@/common/types';

export class UserGetAllResDTO extends UsersCommonoResDTO {
    @ApiProperty({
        example: mockUsers,
        description: 'Users data',
    })
    result: IDBUser[];
}
