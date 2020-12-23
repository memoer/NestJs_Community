import { Injectable, ExecutionContext } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { SharedService } from '~/@shared/shared.service';
import { MessageService } from '~/#message/message.service';
import { PublishType } from '~/#message/message.service';

@Injectable()
export class PubsubService {
  constructor(
    private readonly _sharedService: SharedService,
    private readonly _messageService: MessageService,
  ) {}

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

  initNotifyToUserPublish(context: ExecutionContext, publishType: PublishType) {
    const me = this._sharedService.getMyInfoThroughCtx(context);
    const message = this._messageService.getMsgInSubscription(me, publishType);
    return { me, message };
  }
}
