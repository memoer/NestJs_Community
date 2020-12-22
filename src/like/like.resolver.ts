import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { GetUser } from '~/@auth/user.decorator';
import { CheckModelOf } from '~/@auth/checkModelGuard.decorator';
import { Roles } from '~/@auth/roles.decorator';
import { LikeService } from './like.service';
import { CreateLikeInputArgs, DeleteLikeInputArgs } from './dtos/intput.dto';
import { LikeModel } from './models/like.model';
import { UseInterceptors } from '@nestjs/common';
import { LikeInterceptor } from './like.interceptor';

@Resolver(of => LikeModel)
export class LikeResolver {
  constructor(private readonly _likeService: LikeService) {}

  @Mutation(returns => Boolean)
  @CheckModelOf('Post', 'EXISTS', 'postId')
  @Roles('ANY')
  @UseInterceptors(LikeInterceptor)
  createLike(@GetUser() user: User, @Args() args: CreateLikeInputArgs): Promise<boolean> {
    return this._likeService.createLike(user, args);
  }

  @Mutation(returns => Boolean)
  @CheckModelOf('Like', 'EXISTS')
  deleteLike(@Args() args: DeleteLikeInputArgs): Promise<boolean> {
    return this._likeService.deleteLike(args);
  }
}
