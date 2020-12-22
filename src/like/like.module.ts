import { Module } from '@nestjs/common';
import { PubsubModule } from '~/_pubsub/pubsub.module';
import { LikeResolver } from './like.resolver';
import { LikeService } from './like.service';

@Module({
  imports: [PubsubModule],
  providers: [LikeResolver, LikeService],
})
export class LikeModule {}
