import { Module, Global } from '@nestjs/common';
import { PrismaService } from './database.service';
import databaseErrorCode, { DB_PROVIDE } from './database.errorCode';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: DB_PROVIDE.ERROR_CODE,
      useValue: databaseErrorCode,
    },
  ],
  exports: [PrismaService, DB_PROVIDE.ERROR_CODE],
})
export class PrismaModule {}
