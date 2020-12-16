import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { GetPostListOutputGql, GetPostOneOutputGql } from './dtos/output.dto';
import { Post, User } from '@prisma/client';
import { PostService } from './post.service';
import { Roles } from '~/auth/roles.decorator';
import { AuthUser } from '~/auth/user.decorator';
import { PostIdArgs, CreatePostArgs } from './dtos/input.dto';

@Resolver()
export class PostResolver {
  constructor(private readonly _postService: PostService) {}
  @Query(returns => GetPostListOutputGql)
  @Roles('ANY')
  getMyPost(@AuthUser() user: User): Promise<Post[]> {
    return this._postService.getMyPost(user);
  }
  @Query(returns => GetPostOneOutputGql)
  getPostOne(@Args() args: PostIdArgs): Promise<Post> {
    return this._postService.getPostOne(args);
  }
  @Query(returns => GetPostListOutputGql)
  getPostList(): Promise<Post[]> {
    return this._postService.getPostList();
  }
  @Mutation(returns => GetPostOneOutputGql)
  @Roles('ANY')
  createPost(@AuthUser() user: User, @Args() args: CreatePostArgs): Promise<Post> {
    return this._postService.createPost(user, args);
  }

  // @Mutation(returns =>)
  // deletePost(){

  // }
  // @Mutation(returns =>)
  // updatePost(){

  // }
}
