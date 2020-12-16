import { ObjectType, OmitType } from '@nestjs/graphql';
import { getListOutput } from '~/_shared/dtos/output.dto';
import { PostModel } from '../models/post.model';

@ObjectType()
export class GetPostListOutputGql extends getListOutput(PostModel) {}

@ObjectType()
export class PostWithoutAuthorOutputGql extends OmitType(PostModel, ['author'], ObjectType) {}
