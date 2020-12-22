import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SharedService } from '~/@shared/shared.service';
import { PubsubService } from '~/@pubsub/pubsub.service';
import { NotifyToUserPublishData } from '~/user/user.interface';
import { MessageService } from '~/#message/message.service';

@Injectable()
export class CommentInterceptor implements NestInterceptor {
  constructor(
    private readonly _pubsubService: PubsubService,
    private readonly _sharedSerivce: SharedService,
    private readonly _messageService: MessageService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { NOTIFY_TO_USER } = PubsubService.VALUES;
    const me = this._sharedSerivce.getMyInfo(context);
    const { tags } = context.getArgs()[1];
    const publishData: NotifyToUserPublishData = {
      userIdList: tags,
      message: this._messageService.getMsgOnCommentInSubscription(me),
    };

    return next.handle().pipe(
      tap(() => {
        this._pubsubService.getPubsub().publish(NOTIFY_TO_USER.TRIGGER, {
          [NOTIFY_TO_USER.METHOD_NAME]: publishData,
        });
      }),
    );
  }
}
