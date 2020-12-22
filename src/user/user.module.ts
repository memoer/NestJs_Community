import { Module } from '@nestjs/common';
import { JwtModule } from '~/_jwt/jwt.module';
import { PubsubModule } from '~/_pubsub/pubsub.module';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Module({
  imports: [JwtModule, PubsubModule],
  providers: [UserService, UserResolver],
})
export class UserModule {}
