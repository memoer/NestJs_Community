import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserModel } from '~/user/models/user.model';
import { PostModel } from '~/post/models/post.model';
import { IsNumber, ValidateNested, IsPositive } from 'class-validator';

@ObjectType()
export class LikeModel {
  @Field(type => ID)
  @IsNumber()
  @IsPositive()
  id: number;

  @Field(type => ID)
  @IsNumber()
  @IsPositive()
  userId: number;

  @Field(type => UserModel)
  @ValidateNested()
  user: UserModel;

  @Field(type => ID)
  @IsNumber()
  @IsPositive()
  postId: number;

  @Field(type => PostModel)
  @ValidateNested()
  post: PostModel;
}
