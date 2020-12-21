import { Module, Global } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GlobalGuard } from './global.guard';
import { AuthService } from './auth.service';
import { JwtModule } from '~/jwt/jwt.module';

@Global()
@Module({
  imports: [JwtModule],
  providers: [
    {
      // global guard
      provide: APP_GUARD,
      useClass: GlobalGuard,
    },
    AuthService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
