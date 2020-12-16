import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserModel } from '~/user/models/user.model';
import { CommentModel } from '~/comment/models/comment.models';
import { IsNumber, IsString, IsDate, ValidateNested, IsArray, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { Post } from '@prisma/client';

@ObjectType()
export class PostModel implements Post {
  @Field(type => ID)
  @IsNumber()
  @IsPositive()
  id: number;

  @Field(type => String)
  @IsString()
  title: string;

  @Field(type => String)
  @IsString()
  content: string;

  @Field(type => Date)
  @IsDate()
  createdAt: Date;

  @Field(type => ID)
  @IsNumber()
  @IsPositive()
  authorId: number;

  @ValidateNested()
  author: UserModel;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommentModel)
  comments?: CommentModel[];
}
