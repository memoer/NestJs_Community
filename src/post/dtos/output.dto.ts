import { ObjectType } from '@nestjs/graphql';
import { getOutputGql } from '~/_shared/dtos/output.dto';
import { PostModel } from '../models/post.model';

@ObjectType()
export class GetPostOneOutputGql extends getOutputGql(PostModel) {}

@ObjectType()
export class GetPostListOutputGql extends getOutputGql([PostModel]) {}
