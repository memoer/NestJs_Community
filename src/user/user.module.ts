import { Module } from '@nestjs/common';
import { JwtModule } from '~/@jwt/jwt.module';
import { PubsubModule } from '~/@pubsub/pubsub.module';
import { NotificationModule } from '~/notification/notification.module';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Module({
  imports: [JwtModule, PubsubModule, NotificationModule],
  providers: [UserService, UserResolver],
})
export class UserModule {}
