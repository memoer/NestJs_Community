import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PubsubService } from '~/@pubsub/pubsub.service';
import { NotifyToUserPublishData, NotifyToUserPublishData_Info } from '~/user/user.interface';
import { NotificationService } from '~/notification/notification.service';

@Injectable()
export class CommentInterceptor implements NestInterceptor {
  constructor(
    private readonly _pubsubService: PubsubService,
    private readonly _notificationService: NotificationService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const { NOTIFY_TO_USER } = PubsubService.VALUES;
    const { message } = this._pubsubService.initNotifyToUserPublish(context, 'comment');
    const { tags } = context.getArgs()[1] as { tags: number[] };
    const info = await Promise.all(
      tags.map<Promise<NotifyToUserPublishData_Info>>(async tag => {
        const notification = await this._notificationService.createNotification({
          whoId: tag,
          message,
        });
        return { id: tag, notificationId: notification.id };
      }),
    );
    const publishData: NotifyToUserPublishData = {
      info,
      message: message,
    };

    return next.handle().pipe(
      tap(() => {
        return this._pubsubService.getPubsub().publish(NOTIFY_TO_USER.TRIGGER, {
          [NOTIFY_TO_USER.METHOD_NAME]: publishData,
        });
      }),
    );
  }
}
