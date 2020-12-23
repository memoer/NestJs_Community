import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '~/@database/database.service';
import { PubsubService } from '~/@pubsub/pubsub.service';
import { NotifyToUserPublishData } from '~/user/user.interface';
import { NotificationService } from '~/notification/notification.service';

@Injectable()
export class LikeInterceptor implements NestInterceptor {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _pubsubService: PubsubService,
    private readonly _notificationService: NotificationService,
  ) {}

  private async _getAuthorIdOfPost(context: ExecutionContext): Promise<number> {
    const { postId } = context.getArgs()[1];
    const { authorId } = await this._prismaService.post.findUnique({ where: { id: postId } });
    return authorId;
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const { NOTIFY_TO_USER } = PubsubService.VALUES;
    const { message } = this._pubsubService.initNotifyToUserPublish(context, 'like');
    const authorId = await this._getAuthorIdOfPost(context);
    const notification = await this._notificationService.createNotification({
      whoId: authorId,
      message,
    });
    const publishData: NotifyToUserPublishData = {
      info: { id: authorId, notificationId: notification.id },
      message: message,
    };

    return next.handle().pipe(
      tap(() =>
        this._pubsubService.getPubsub().publish(NOTIFY_TO_USER.TRIGGER, {
          [NOTIFY_TO_USER.METHOD_NAME]: publishData,
        }),
      ),
    );
  }
}
