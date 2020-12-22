import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Inject,
  applyDecorators,
  SetMetadata,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { META_DATA } from '~/_shared/shared.constants';
import { PrismaService } from '~/_database/database.service';
import { NotifyToUserOutputGql } from '~/user/dtos/output.dto';
import { ReturnedContext } from '~/_graphql/graphql.factory';
import { PROVIDE_PUB_SUB, PROVIDE_SUBSRCIPTIONS } from './pubsub.constants';
import { ProvideSubscriptions } from './pubsub.module';

export type NotifyCategory = 'LIKE' | 'TAG_OF_COMMENT';

@Injectable()
export class PubsubInterceptor implements NestInterceptor {
  private _me: User = null;
  constructor(
    @Inject(PROVIDE_PUB_SUB) private readonly _pubsub: RedisPubSub,
    @Inject(PROVIDE_SUBSRCIPTIONS) private readonly _pubsubSubscriptions: ProvideSubscriptions,
    private readonly _reflector: Reflector,
    private readonly _prismaService: PrismaService,
  ) {}

  private _getMyInfo(context: ExecutionContext): void {
    const user = GqlExecutionContext.create(context).getContext<ReturnedContext>().user;
    if (!user) throw new NotFoundException('[pubsub.interceptor]_getMyInfo: user not found Error');
    this._me = user;
  }

  private async _notifyLike(context: ExecutionContext): Promise<void> {
    const { postId } = context.getArgs()[1];
    const { authorId } = await this._prismaService.post.findUnique({ where: { id: postId } });
    const publishData: NotifyToUserOutputGql = {
      userId: authorId,
      message: `${this._me.name} 님이 좋아요를 클릭했습니다.`,
    };
    return this._pubsub.publish(this._pubsubSubscriptions.NOTIFY_TO_USER.TIGGIER, {
      [this._pubsubSubscriptions.NOTIFY_TO_USER.SUBSCRIPTION]: publishData,
    });
  }

  private _tabHandler(context: ExecutionContext): () => void {
    const notifyCategory = this._reflector.get<NotifyCategory>(
      META_DATA.KEY.NOTIFY_TO_USER,
      context.getHandler(),
    );
    return (): void => {
      switch (notifyCategory) {
        case 'LIKE':
          this._notifyLike(context);
          break;
        case 'TAG_OF_COMMENT':
          break;
      }
    };
  }

  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this._getMyInfo(context);
    return next.handle().pipe(tap(this._tabHandler(context)));
  }
}

export function NotifyToUserAbout(notifyCategory: NotifyCategory) {
  const {
    KEY: { NOTIFY_TO_USER },
  } = META_DATA;
  return applyDecorators(
    SetMetadata(NOTIFY_TO_USER, notifyCategory),
    UseInterceptors(PubsubInterceptor),
  );
}
