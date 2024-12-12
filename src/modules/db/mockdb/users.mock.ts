import { IDBUser } from '@/common/types'

export const mockUsers: IDBUser[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashedpassword1',
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: 'hashedpassword2',
    },
];
