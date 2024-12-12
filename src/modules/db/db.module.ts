import { Module, Global } from '@nestjs/common';
import { DbService } from './db.service';

@Global()
@Module({
    providers: [DbService],
})
export class DBModule { }
