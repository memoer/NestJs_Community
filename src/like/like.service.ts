import {
  Injectable,
  InternalServerErrorException,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '~/_database/database.service';
import databaseErrorCode, { DB_PROVIDE } from '~/_database/database.errorCode';
import { CreateLikeInputArgs, DeleteLikeInputArgs } from './dtos/intput.dto';

@Injectable()
export class LikeService {
  constructor(
    @Inject(DB_PROVIDE.ERROR_CODE) private readonly _prismaConstants: typeof databaseErrorCode,
    private readonly _prismaService: PrismaService,
  ) {}

  async createLike(user: User, { postId }: CreateLikeInputArgs): Promise<boolean> {
    try {
      await this._prismaService.like.create({
        data: { user: { connect: { id: user.id } }, post: { connect: { id: postId } } },
      });
      return true;
    } catch (error) {
      if (error.code === this._prismaConstants.CONSTRAINT.UNIQUE) {
        throw new ConflictException('already existed like');
      }
      throw new InternalServerErrorException(error);
    }
  }

  async deleteLike({ id }: DeleteLikeInputArgs): Promise<boolean> {
    await this._prismaService.like.delete({ where: { id } });
    return true;
  }
}
