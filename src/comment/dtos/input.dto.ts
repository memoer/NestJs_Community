import { PickType, ArgsType, Field, Int, PartialType, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { IsOptional, IsArray, IsNumber, IsPositive, IsBoolean } from 'class-validator';
import { PaginatedArgs } from '~/@shared/dtos/input.dto';
import { CommentModel } from '../models/comment.models';

@InputType('CommentIncludeInputType')
class CommentInclude implements Prisma.CommentInclude {
  @Field(type => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  author?: boolean;

  @Field(type => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  childs?: boolean;
}

@ArgsType()
export class GetCommentOfPostArgs extends PaginatedArgs {
  @Field(type => Int)
  @IsNumber()
  @IsPositive()
  postId: number;

  @Field(type => CommentInclude, { nullable: true })
  @IsOptional()
  include?: CommentInclude;
}

@ArgsType()
export class CreateCommentArgs extends PickType(CommentModel, ['content', 'postId'], ArgsType) {
  @Field(type => [Int], { nullable: 'itemsAndList' })
  @IsArray()
  @IsOptional()
  tags: number[];
}

@ArgsType()
export class CreateChildCommentArgs extends PickType(CommentModel, ['content'], ArgsType) {
  @Field(type => [Int], { nullable: 'itemsAndList' })
  @IsArray()
  @IsOptional()
  tags: number[];

  @Field(type => Int)
  @IsNumber()
  @IsPositive()
  parentId: number;
}

@ArgsType()
export class UpdateCommentArgs extends PickType(
  PartialType(CommentModel),
  ['content', 'tags'],
  ArgsType,
) {
  @Field(type => Int)
  @IsNumber()
  @IsPositive()
  id: number;
}
