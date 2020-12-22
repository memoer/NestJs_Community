import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '~/@database/database.service';
import { tap } from 'rxjs/operators';
import { PubsubService } from '~/@pubsub/pubsub.service';
import { SharedService } from '~/@shared/shared.service';
import { NotifyToUserPublishData } from '~/user/user.interface';
import { MessageService } from '~/#message/message.service';

@Injectable()
export class LikeInterceptor implements NestInterceptor {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _pubsubService: PubsubService,
    private readonly _sharedService: SharedService,
    private readonly _messageService: MessageService,
  ) {}

  private async _getAuthorIdOfPost(context: ExecutionContext): Promise<number> {
    const { postId } = context.getArgs()[1];
    const { authorId } = await this._prismaService.post.findUnique({ where: { id: postId } });
    return authorId;
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const { NOTIFY_TO_USER } = PubsubService.VALUES;
    const me = this._sharedService.getMyInfo(context);
    const authorId = await this._getAuthorIdOfPost(context);
    const publishData: NotifyToUserPublishData = {
      userIdList: [authorId],
      message: this._messageService.getMsgOnLikeInSubscription(me),
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
