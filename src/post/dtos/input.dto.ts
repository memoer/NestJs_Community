import { ArgsType, PickType, PartialType, Int, Field } from '@nestjs/graphql';
import { IsNumber, IsPositive } from 'class-validator';
import { PostModel } from '../models/post.model';

@ArgsType()
export class CreatePostArgs extends PickType(PostModel, ['title', 'content'], ArgsType) {}

@ArgsType()
export class UpdatePostArgs extends PickType(
  PartialType(PostModel),
  ['title', 'content'],
  ArgsType,
) {
  @Field(type => Int)
  @IsNumber()
  @IsPositive()
  id: number;
}
