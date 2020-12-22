import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { GetUser } from '~/_auth/user.decorator';
import { CheckModelOf } from '~/_auth/checkModelGuard.decorator';
import { NotifyToUserAbout } from '~/_pubsub/pubsub.interceptor';
import { Roles } from '~/_auth/roles.decorator';
import { LikeService } from './like.service';
import { CreateLikeInputArgs, DeleteLikeInputArgs } from './dtos/intput.dto';
import { LikeModel } from './models/like.model';

@Resolver(of => LikeModel)
export class LikeResolver {
  constructor(private readonly _likeService: LikeService) {}

  @Mutation(returns => Boolean)
  @CheckModelOf('Post', 'EXISTS', 'postId')
  @Roles('ANY')
  @NotifyToUserAbout('LIKE')
  createLike(@GetUser() user: User, @Args() args: CreateLikeInputArgs): Promise<boolean> {
    return this._likeService.createLike(user, args);
  }

  @Mutation(returns => Boolean)
  @CheckModelOf('Like', 'EXISTS')
  deleteLike(@Args() args: DeleteLikeInputArgs): Promise<boolean> {
    return this._likeService.deleteLike(args);
  }
}
