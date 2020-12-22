import { Module } from '@nestjs/common';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';
import { PubsubModule } from '~/@pubsub/pubsub.module';
import { MessageModule } from '~/#message/message.module';

@Module({
  imports: [PubsubModule, MessageModule],
  providers: [CommentResolver, CommentService],
})
export class CommentModule {}
