import { Injectable } from '@nestjs/common';
import { User, Comment } from '@prisma/client';
import { PrismaService } from '~/_database/database.service';
import { SuccessOutput, GetListOutput } from '~/_shared/dtos/output.dto';
import { GetOneArgs } from '~/_shared/dtos/input.dto';
import { CreateCommentArgs, GetCommentOfPostArgs, UpdateCommentArgs } from './dtos/input.dto';

@Injectable()
export class CommentService {
  constructor(private readonly _prismaService: PrismaService) {}
  async getCommentOfPost({
    postId,
    ...args
  }: GetCommentOfPostArgs): Promise<GetListOutput<Comment>> {
    const { take, page, include } = args;
    const skip = (page - 1) * take;
    const data = await this._prismaService.comment.findMany({
      where: { postId },
      include,
      skip,
    });
    const count = await this._prismaService.comment.count({ where: { postId } });
    return { data, count, page, take };
  }

  async createComment(
    user: User,
    { postId, content, tags, commentId }: CreateCommentArgs,
  ): Promise<Comment> {
    return this._prismaService.comment.create({
      data: {
        content,
        author: { connect: { id: user.id } },
        tags: tags ? tags.join('/') : undefined,
        ...(commentId
          ? { Comment: { connect: { id: commentId } } }
          : { post: { connect: { id: postId } } }),
      },
    });
  }

  async deleteComment({ id }: GetOneArgs): Promise<SuccessOutput> {
    await this._prismaService.comment.delete({ where: { id } });
    return { ok: true };
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
