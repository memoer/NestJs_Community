import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GlobalGuard } from './global.guard';

@Module({
  providers: [
    {
      // global guard
      // SharedGuard에서 DI가 가능
      // main.ts 에서 useGlobalGuards를 사용할 경우, SharedGuard에서 DI가 불가능하다.
      provide: APP_GUARD,
      useClass: GlobalGuard,
    },
  ],
})
export class AuthModule {}
