import { Injectable } from '@nestjs/common';
import { User, Comment } from '@prisma/client';
import { PrismaService } from '~/@database/database.service';
import { GetListOutput } from '~/@shared/dtos/output.dto';
import { GetOneArgs } from '~/@shared/dtos/input.dto';
import {
  CreateCommentArgs,
  GetCommentOfPostArgs,
  UpdateCommentArgs,
  CreateChildCommentArgs,
} from './dtos/input.dto';

@Injectable()
export class CommentService {
  constructor(private readonly _prismaService: PrismaService) {}

  private async _getPostIdOfParentComment(parentId: number): Promise<number> {
    const parentComment = await this._prismaService.comment.findUnique({
      where: { id: parentId },
    });
    return parentComment.postId;
  }

  private _transformTags(tags?: number[]) {
    if (!tags) return undefined;
    return tags.join('/');
  }

  async getCommentOfPost({
    postId,
    ...args
  }: GetCommentOfPostArgs): Promise<GetListOutput<Comment>> {
    const { take, page, include } = args;
    const skip = (page - 1) * take;
    const data = await this._prismaService.comment.findMany({
      where: { postId, commentId: null },
      include,
      skip,
    });
    const count = await this._prismaService.comment.count({ where: { postId } });
    return { data, count, page, take };
  }

  async createComment(user: User, { content, tags, postId }: CreateCommentArgs): Promise<Comment> {
    return this._prismaService.comment.create({
      data: {
        content,
        tags: this._transformTags(tags),
        author: { connect: { id: user.id } },
        post: { connect: { id: postId } },
      },
    });
  }

  async createChildComment(user: User, { content, tags, parentId }: CreateChildCommentArgs) {
    const postId = await this._getPostIdOfParentComment(parentId);
    return this._prismaService.comment.create({
      data: {
        content,
        tags: this._transformTags(tags),
        author: { connect: { id: user.id } },
        post: { connect: { id: postId } },
        Comment: { connect: { id: parentId } },
      },
    });
  }

  async deleteComment({ id }: GetOneArgs): Promise<boolean> {
    await this._prismaService.comment.delete({ where: { id } });
    return true;
  }

  async updateComment({ id, ...args }: UpdateCommentArgs): Promise<Comment> {
    return this._prismaService.comment.update({
      where: {
        id,
      },
      data: args,
    });
  }
}
