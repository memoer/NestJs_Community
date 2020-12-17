import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { SuccessOutput } from '~/_shared/dtos/output.dto';
import { LikeService } from './like.service';
import { GetUser } from '~/auth/user.decorator';
import { CreateLikeInputArgs, DeleteLikeInputArgs } from './dtos/intput.dto';
import { LikeModel } from './models/like.model';
import { CheckModelOf } from '~/auth/checkModelGuard.decorator';

@Resolver(of => LikeModel)
export class LikeResolver {
  constructor(private readonly _likeService: LikeService) {}

  @Mutation(returns => SuccessOutput)
  @CheckModelOf('Post', 'EXISTS', 'postId')
  createLike(@GetUser() user: User, @Args() args: CreateLikeInputArgs): Promise<SuccessOutput> {
    return this._likeService.createLike(user, args);
  }

  @Mutation(returns => SuccessOutput)
  @CheckModelOf('Like', 'EXISTS')
  deleteLike(@Args() args: DeleteLikeInputArgs): Promise<SuccessOutput> {
    return this._likeService.deleteLike(args);
  }
}
