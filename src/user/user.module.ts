import { Module } from '@nestjs/common';
import { JwtModule } from '~/jwt/jwt.module';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PubsubModule } from '~/_pubsub/pubsub.module';

@Module({
  imports: [JwtModule, PubsubModule],
  providers: [UserService, UserResolver],
})
export class UserModule {}
