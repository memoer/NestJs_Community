import { Injectable } from '@nestjs/common';
import { SuccessOutput } from '~/_shared/dtos/output.dto';
import { User } from '@prisma/client';
import { CreateLikeInputArgs, DeleteLikeInputArgs } from './dtos/intput.dto';
import { PrismaService } from '~/_database/database.service';

@Injectable()
export class LikeService {
  constructor(private readonly _prismaService: PrismaService) {}

  async createLike(user: User, { postId }: CreateLikeInputArgs): Promise<SuccessOutput> {
    await this._prismaService.like.create({
      data: { user: { connect: { id: user.id } }, post: { connect: { id: postId } } },
    });
    return { ok: true };
  }

  async deleteLike(user: User, { id }: DeleteLikeInputArgs): Promise<SuccessOutput> {
    return { ok: true };
    await this._prismaService.like.delete({ where: {} });
  }
}
