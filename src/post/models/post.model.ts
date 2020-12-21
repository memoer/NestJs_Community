import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { UserModel } from '~/user/models/user.model';
import { CommentModel } from '~/comment/models/comment.models';
import {
  IsNumber,
  IsString,
  IsDate,
  ValidateNested,
  IsArray,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Post } from '@prisma/client';

@InputType('PostModelInputType', { isAbstract: true })
@ObjectType('PostModelObjectType')
export class PostModel implements Post {
  @Field(type => Int)
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

  @Field(type => Int)
  @IsNumber()
  @IsPositive()
  authorId: number;

  @Field(type => UserModel)
  @ValidateNested()
  author: UserModel;

  @Field(type => [CommentModel], { nullable: 'itemsAndList' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommentModel)
  @IsOptional()
  comments?: CommentModel[];
}
