import { Module } from '@nestjs/common';
import { JwtModule } from '~/jwt/jwt.module';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Module({
  imports: [JwtModule],
  providers: [UserService, UserResolver],
})
export class UserModule {}
