import { Module } from '@nestjs/common';
import { PubsubModule } from '~/@pubsub/pubsub.module';
import { NotificationModule } from '~/notification/notification.module';
import { LikeResolver } from './like.resolver';
import { LikeService } from './like.service';

@Module({
  imports: [PubsubModule, NotificationModule],
  providers: [LikeResolver, LikeService],
})
export class LikeModule {}
