import { Module } from '@nestjs/common';
import { PubsubModule } from '~/@pubsub/pubsub.module';
import { LikeResolver } from './like.resolver';
import { LikeService } from './like.service';
import { MessageModule } from '~/#message/message.module';

@Module({
  imports: [PubsubModule, MessageModule],
  providers: [LikeResolver, LikeService],
})
export class LikeModule {}
