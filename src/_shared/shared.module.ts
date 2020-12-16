import { Module, Global } from '@nestjs/common';
import { SharedService } from './shared.service';
import { MyConfigModule } from '~/_config/config.module';
import { APP_FILTER } from '@nestjs/core';
import { SharedExceptionFilter } from './shared.filter.ts';

@Global()
@Module({
  imports: [MyConfigModule],
  providers: [SharedService, { provide: APP_FILTER, useClass: SharedExceptionFilter }],
  exports: [SharedService],
})
export class SharedModule {}
