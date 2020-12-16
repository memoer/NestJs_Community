import { ArgsType, PickType } from '@nestjs/graphql';
import { PostModel } from '../models/post.model';

@ArgsType()
export class PostIdArgs extends PickType(PostModel, ['id'], ArgsType) {}

@ArgsType()
export class CreatePostArgs extends PickType(PostModel, ['title', 'content'], ArgsType) {}
