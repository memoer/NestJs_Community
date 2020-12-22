import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Like } from '@prisma/client';
import { IsNumber, ValidateNested, IsPositive } from 'class-validator';
import { UserModel } from '~/user/models/user.model';
import { PostModel } from '~/post/models/post.model';

@ObjectType()
export class LikeModel implements Like {
  @Field(type => Int)
  @IsNumber()
  @IsPositive()
  id: number;

  @Field(type => Int)
  @IsNumber()
  @IsPositive()
  userId: number;

  @Field(type => UserModel)
  @ValidateNested()
  user: UserModel;

  @Field(type => Int)
  @IsNumber()
  @IsPositive()
  postId: number;

  @Field(type => PostModel)
  @ValidateNested()
  post: PostModel;
}
