import { ArgsType, PickType, PartialType } from '@nestjs/graphql';
import { PostModel } from '../models/post.model';

@ArgsType()
export class CreatePostArgs extends PickType(PostModel, ['title', 'content'], ArgsType) {}

@ArgsType()
export class UpdatePostArgs extends PickType(
  PartialType(PostModel),
  ['id', 'title', 'content'],
  ArgsType,
) {}
