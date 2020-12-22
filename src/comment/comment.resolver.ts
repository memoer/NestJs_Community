import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Comment, User } from '@prisma/client';
import { GetListOutput } from '~/_shared/dtos/output.dto';
import { GetOneArgs } from '~/_shared/dtos/input.dto';
import { CheckModelOf } from '~/_auth/checkModelGuard.decorator';
import { GetUser } from '~/_auth/user.decorator';
import { CommentService } from './comment.service';
import { CommentModel } from './models/comment.models';
import {
  CreateCommentArgs,
  CreateChildCommentArgs,
  GetCommentOfPostArgs,
  UpdateCommentArgs,
} from './dtos/input.dto';
import { GetCommentOutputGql } from './dtos/output.dto';

@Resolver(of => CommentModel)
export class CommentResolver {
  constructor(private readonly _commentService: CommentService) {}
  @Query(returns => GetCommentOutputGql)
  getCommentOfPost(@Args() args: GetCommentOfPostArgs): Promise<GetListOutput<Comment>> {
    return this._commentService.getCommentOfPost(args);
  }

  @Mutation(returns => CommentModel)
  @CheckModelOf('Post', 'EXISTS', 'postId')
  createComment(@GetUser() user: User, @Args() args: CreateCommentArgs): Promise<Comment> {
    return this._commentService.createComment(user, args);
  }

  @Mutation(returns => CommentModel)
  @CheckModelOf('Comment', 'EXISTS', 'parentId')
  createChildComment(@GetUser() user: User, @Args() args: CreateChildCommentArgs) {
    return this._commentService.createChildComment(user, args);
  }

  @Mutation(returns => Boolean)
  @CheckModelOf('Comment', 'MINE')
  deleteComment(@Args() args: GetOneArgs): Promise<boolean> {
    return this._commentService.deleteComment(args);
  }

  @Mutation(returns => CommentModel)
  @CheckModelOf('Comment', 'MINE')
  updateComment(@Args() args: UpdateCommentArgs): Promise<Comment> {
    return this._commentService.updateComment(args);
  }
}
