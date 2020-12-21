import { Resolver, Mutation, Query, Args, ResolveField, Int, Parent } from '@nestjs/graphql';
import { Post, User } from '@prisma/client';
import { Roles } from '~/auth/roles.decorator';
import { GetUser } from '~/auth/user.decorator';
import { PaginatedIncludeArgs, GetOneIncludeArgs, GetOneArgs } from '~/_shared/dtos/input.dto';
import { GetListOutput, SuccessOutput } from '~/_shared/dtos/output.dto';
import { CheckModelOf } from '~/auth/checkModelGuard.decorator';
import { PostService } from './post.service';
import { CreatePostArgs, UpdatePostArgs } from './dtos/input.dto';
import { PostModel } from './models/post.model';
import { GetPostListOutputGql, PostWithoutAuthorOutputGql } from './dtos/output.dto';

@Resolver(of => PostModel)
export class PostResolver {
  constructor(private readonly _postService: PostService) {}

  @ResolveField(type => Int)
  likeCount(@Parent() data: Post): Promise<number> {
    return this._postService.likeCount(data.id);
  }

  @Query(returns => GetPostListOutputGql)
  @Roles('ANY')
  getMyPost(
    @GetUser() user: User,
    @Args() args: PaginatedIncludeArgs,
  ): Promise<GetListOutput<Post>> {
    return this._postService.getMyPost(user, args);
  }

  @Query(returns => PostModel)
  getPostOne(@Args() args: GetOneIncludeArgs): Promise<Post> {
    return this._postService.getPostOne(args);
  }

  @Query(returns => GetPostListOutputGql)
  getPostList(@Args() args: PaginatedIncludeArgs): Promise<GetListOutput<Post>> {
    return this._postService.getPostList(args);
  }

  @Mutation(returns => PostWithoutAuthorOutputGql)
  @Roles('ANY')
  createPost(@GetUser() user: User, @Args() args: CreatePostArgs): Promise<Post> {
    return this._postService.createPost(user, args);
  }

  @Mutation(returns => SuccessOutput)
  @CheckModelOf('Post', 'MINE')
  deletePost(@Args() args: GetOneArgs): Promise<SuccessOutput> {
    return this._postService.deletePost(args);
  }

  @Mutation(returns => PostWithoutAuthorOutputGql)
  @CheckModelOf('Post', 'MINE')
  updatePost(@Args() args: UpdatePostArgs): Promise<Post> {
    return this._postService.updatePost(args);
  }
}
