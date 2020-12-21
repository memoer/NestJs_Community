import { Module } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PROVIDE_PUB_SUB, PROVIDE_SUBSRCIPTIONS } from './pubsub.constants';

export interface ProvideSubscriptions {
  NOTIFY_TO_USER: {
    TIGGIER: 'NOTIFY_TO_USER';
    SUBSCRIPTION: 'notifyToUser';
  };
}

@Module({
  providers: [
    { provide: PROVIDE_PUB_SUB, useValue: new RedisPubSub() },
    {
      provide: PROVIDE_SUBSRCIPTIONS,
      useValue: { NOTIFY_TO_USER: { TIGGIER: 'NOTIFY_TO_USER', SUBSCRIPTION: 'notifyToUser' } },
    },
  ],
  exports: [PROVIDE_PUB_SUB, PROVIDE_SUBSRCIPTIONS],
})
export class PubsubModule {}
