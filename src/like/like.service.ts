import { Injectable } from '@nestjs/common';
import { SuccessOutput } from '~/_shared/dtos/output.dto';
import { User } from '@prisma/client';
import { CreateLikeInputArgs, DeleteLikeInputArgs } from './dtos/intput.dto';
import { PrismaService } from '~/_database/database.service';
import { SharedService } from '~/_shared/shared.service';

@Injectable()
export class LikeService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _sharedService: SharedService,
  ) {}

  async createLike(user: User, { postId }: CreateLikeInputArgs): Promise<SuccessOutput> {
    // SELECT * FROM "Post" WHERE id = $postId FOR SHARE 해주어야 하나?
    const getPost = this._prismaService.post.findUnique({ where: { id: postId } });
    const createLike = this._prismaService.like.create({
      data: { user: { connect: { id: user.id } }, post: { connect: { id: postId } } },
    });
    await this._prismaService.$transaction([getPost, createLike]);
    return this._sharedService.successResponse();
  }

  async deleteLike({ id }: DeleteLikeInputArgs): Promise<SuccessOutput> {
    await this._prismaService.like.delete({ where: { id } });
    return this._sharedService.successResponse();
  }
}
