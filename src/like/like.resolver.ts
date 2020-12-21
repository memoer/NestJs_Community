import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { SuccessOutput } from '~/_shared/dtos/output.dto';
import { GetUser } from '~/auth/user.decorator';
import { CheckModelOf } from '~/auth/checkModelGuard.decorator';
import { LikeService } from './like.service';
import { CreateLikeInputArgs, DeleteLikeInputArgs } from './dtos/intput.dto';
import { LikeModel } from './models/like.model';
import { NotifyToUserAbout } from '~/_pubsub/pubsub.interceptor';
import { Roles } from '~/auth/roles.decorator';

@Resolver(of => LikeModel)
export class LikeResolver {
  constructor(private readonly _likeService: LikeService) {}

  @Mutation(returns => SuccessOutput)
  @CheckModelOf('Post', 'EXISTS', 'postId')
  @Roles('ANY')
  @NotifyToUserAbout('LIKE')
  createLike(@GetUser() user: User, @Args() args: CreateLikeInputArgs): Promise<SuccessOutput> {
    return this._likeService.createLike(user, args);
  }

  @Mutation(returns => SuccessOutput)
  @CheckModelOf('Like', 'EXISTS')
  deleteLike(@Args() args: DeleteLikeInputArgs): Promise<SuccessOutput> {
    return this._likeService.deleteLike(args);
  }
}
