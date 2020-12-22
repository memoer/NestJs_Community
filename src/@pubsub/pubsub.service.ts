import { Injectable } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Injectable()
export class PubsubService {
  static readonly VALUES = {
    NOTIFY_TO_USER: {
      TRIGGER: 'NOTIFY_TO_USER',
      METHOD_NAME: 'notifyToUser',
    } as const,
  };

  private readonly _pubsub = new RedisPubSub();

  getPubsub() {
    return this._pubsub;
  }
}
