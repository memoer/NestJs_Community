import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Comment, User } from '@prisma/client';
import { SuccessOutput, GetListOutput } from '~/_shared/dtos/output.dto';
import { GetOneArgs } from '~/_shared/dtos/input.dto';
import { CheckModelOf } from '~/auth/checkModelGuard.decorator';
import { CommentService } from './comment.service';
import { CommentModel } from './models/comment.models';
import { GetUser } from '~/auth/user.decorator';
import { CreateCommentArgs, GetCommentOfPostArgs, UpdateCommentArgs } from './dtos/input.dto';
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

  @Mutation(returns => SuccessOutput)
  @CheckModelOf('Comment', 'MINE')
  deleteComment(@Args() args: GetOneArgs): Promise<SuccessOutput> {
    return this._commentService.deleteComment(args);
  }

  @Mutation(returns => CommentModel)
  @CheckModelOf('Comment', 'MINE')
  updateComment(@Args() args: UpdateCommentArgs): Promise<Comment> {
    return this._commentService.updateComment(args);
  }
}
