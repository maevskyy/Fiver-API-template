import { Module } from '@nestjs/common';
import { UrlConfigController } from './url-config.controller';

@Module({
  controllers: [UrlConfigController]
})
export class UrlConfigModule {}
