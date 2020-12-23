import { Module } from '@nestjs/common';
import { PubsubModule } from '~/@pubsub/pubsub.module';
import { NotificationModule } from '~/notification/notification.module';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';

@Module({
  imports: [PubsubModule, NotificationModule],
  providers: [CommentResolver, CommentService],
})
export class CommentModule {}
