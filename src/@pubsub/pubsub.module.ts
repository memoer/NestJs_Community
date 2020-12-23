import { Module } from '@nestjs/common';
import { PubsubService } from './pubsub.service';
import { MessageModule } from '~/#message/message.module';

@Module({
  imports: [MessageModule],
  providers: [PubsubService],
  exports: [PubsubService],
})
export class PubsubModule {}
