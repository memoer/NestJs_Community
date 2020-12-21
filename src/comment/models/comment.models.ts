import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { UserModel } from '~/user/models/user.model';
import { PostModel } from '~/post/models/post.model';
import {
  IsNumber,
  IsString,
  ValidateNested,
  IsPositive,
  IsOptional,
  IsDate,
  IsArray,
} from 'class-validator';
import { Comment } from '@prisma/client';
import { Type } from 'class-transformer';

@ObjectType()
class CommentChildModel {
  @Field(type => Int)
  @IsNumber()
  @IsPositive()
  id: number;

  @Field(type => String)
  @IsString()
  content: string;

  @Field(type => Date)
  @IsDate()
  createdAt: Date;

  @Field(type => Int)
  @IsNumber()
  @IsPositive()
  authorId: number;

  @Field(type => UserModel)
  @ValidateNested()
  author: UserModel;

  @Field(type => String, { nullable: true })
  @IsOptional()
  tags: string | null;
}

@InputType('CommentModelInputType', { isAbstract: true })
@ObjectType('CommentModelObjectType')
export class CommentModel implements Comment {
  @Field(type => Int)
  @IsNumber()
  @IsPositive()
  id: number;

  @Field(type => String)
  @IsString()
  content: string;

  @Field(type => Date)
  @IsDate()
  createdAt: Date;

  @Field(type => Int)
  @IsNumber()
  @IsPositive()
  authorId: number;

  @Field(type => UserModel)
  @ValidateNested()
  author: UserModel;

  @Field(type => Int, { nullable: true })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  postId: number | null;

  @Field(type => PostModel, { nullable: true })
  @ValidateNested()
  @IsOptional()
  post: PostModel;

  @Field(type => String, { nullable: true })
  @IsOptional()
  tags: string | null;

  @Field(type => Int, { nullable: true })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  commentId: number | null;

  @Field(type => [CommentChildModel], { nullable: 'itemsAndList' })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CommentChildModel)
  childs?: CommentChildModel[];
}
