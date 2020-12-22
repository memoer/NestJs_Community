import { ObjectType } from '@nestjs/graphql';
import { getListOutput } from '~/@shared/dtos/output.dto';
import { CommentModel } from '../models/comment.models';

@ObjectType()
export class GetCommentOutputGql extends getListOutput(CommentModel) {}
