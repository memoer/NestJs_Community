import { Module } from '@nestjs/common';
import { LikeResolver } from './like.resolver';
import { LikeService } from './like.service';
import { PubsubModule } from '~/_pubsub/pubsub.module';

@Module({
  imports: [PubsubModule],
  providers: [LikeResolver, LikeService],
})
export class LikeModule {}
