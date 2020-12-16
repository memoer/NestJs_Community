import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserModel } from '~/user/models/user.model';
import { PostModel } from '~/post/models/post.model';
import {
  IsNumber,
  IsString,
  ValidateNested,
  IsArray,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

@ObjectType()
export class CommentModel {
  @Field(type => ID)
  @IsNumber()
  @IsPositive()
  id: number;

  @Field(type => String)
  @IsString()
  content: string;

  @Field(type => ID)
  @IsNumber()
  @IsPositive()
  authorId: number;

  @Field(type => UserModel)
  @ValidateNested()
  author: UserModel;

  @Field(type => ID)
  @IsNumber()
  @IsPositive()
  postId: number;

  @Field(type => PostModel)
  @ValidateNested()
  post: PostModel;
}
