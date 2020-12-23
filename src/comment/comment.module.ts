import { Module } from '@nestjs/common';
import { PubsubModule } from '~/@pubsub/pubsub.module';
import { MessageModule } from '~/#message/message.module';
import { NotificationModule } from '~/notification/notification.module';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';

@Module({
  imports: [PubsubModule, MessageModule, NotificationModule],
  providers: [CommentResolver, CommentService],
})
export class CommentModule {}
