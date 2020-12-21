import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Inject,
  applyDecorators,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PROVIDE_PUB_SUB, PROVIDE_SUBSRCIPTIONS } from './pubsub.constants';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { META_DATA } from '~/_shared/shared.constants';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '~/_database/database.service';
import { ProvideSubscriptions } from './pubsub.module';
import { NotifyToUserOutputGql } from '~/user/dtos/output.dto';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ReturnedContext } from '~/_graphql/graphql.factory';

export type NotifyCategory = 'LIKE' | 'TAG_OF_COMMENT';

@Injectable()
export class PubsubInterceptor implements NestInterceptor {
  constructor(
    private readonly _reflector: Reflector,
    @Inject(PROVIDE_PUB_SUB) private readonly _pubsub: RedisPubSub,
    @Inject(PROVIDE_SUBSRCIPTIONS) private readonly _pubsubSubscriptions: ProvideSubscriptions,
    private readonly _prismaService: PrismaService,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const {
      KEY: { NOTIFY_TO_USER },
    } = META_DATA;
    const { user } = GqlExecutionContext.create(context).getContext<ReturnedContext>();
    const notifyCategory = this._reflector.get<NotifyCategory>(
      NOTIFY_TO_USER,
      context.getHandler(),
    );
    return next.handle().pipe(
      tap(async () => {
        if (notifyCategory === 'LIKE') {
          const { postId } = context.getArgs()[1];
          const { authorId } = await this._prismaService.post.findUnique({ where: { id: postId } });
          const publishData: NotifyToUserOutputGql = {
            userId: authorId,
            message: `${user.name} 님이 좋아요를 클릭했습니다!`,
          };
          this._pubsub.publish(this._pubsubSubscriptions.NOTIFY_TO_USER.TIGGIER, {
            [this._pubsubSubscriptions.NOTIFY_TO_USER.SUBSCRIPTION]: publishData,
          });
        }
      }),
    );
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
