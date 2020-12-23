import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '~/@database/database.service';
import { PubsubService } from '~/@pubsub/pubsub.service';
import { SharedService } from '~/@shared/shared.service';
import { NotifyToUserPublishData } from '~/user/user.interface';
import { MessageService } from '~/#message/message.service';
import { NotificationService } from '~/notification/notification.service';

@Injectable()
export class LikeInterceptor implements NestInterceptor {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _pubsubService: PubsubService,
    private readonly _sharedService: SharedService,
    private readonly _messageService: MessageService,
    private readonly _notificationService: NotificationService,
  ) {}

  private async _getAuthorIdOfPost(context: ExecutionContext): Promise<number> {
    const { postId } = context.getArgs()[1];
    const { authorId } = await this._prismaService.post.findUnique({ where: { id: postId } });
    return authorId;
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const { NOTIFY_TO_USER } = PubsubService.VALUES;
    // const me = this._sharedService.getMyInfo(context);
    // const authorId = await this._getAuthorIdOfPost(context);
    // const publishData: NotifyToUserPublishData = {
    //   userIdList: [authorId],
    //   message: this._messageService.getMsgOnLikeInSubscription(me),
    // };
    return next.handle().pipe(
      tap(() => {
        // await 하지 않고 바로 다음 로직 진행
        // 다음 로직을 진행하는 데에 있어서 굳이 해당 기능을 기다릴 필요가 없을 것 같다 생각하여 "await" 스킵
        // this._notificationService.createNotification({
        //   whoId: authorId,
        //   content: publishData.message,
        // });
        return this._pubsubService.getPubsub().publish(NOTIFY_TO_USER.TRIGGER, {
          [NOTIFY_TO_USER.METHOD_NAME]: { notificationId: 1 },
        });
      }),
    );
  }
}
