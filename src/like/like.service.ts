import {
  Injectable,
  InternalServerErrorException,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { SuccessOutput } from '~/_shared/dtos/output.dto';
import { PrismaService } from '~/_database/database.service';
import { SharedService } from '~/_shared/shared.service';
import databaseErrorCode, { DB_PROVIDE } from '~/_database/database.errorCode';
import { CreateLikeInputArgs, DeleteLikeInputArgs } from './dtos/intput.dto';

@Injectable()
export class LikeService {
  constructor(
    private readonly _prismaService: PrismaService,
    @Inject(DB_PROVIDE.ERROR_CODE)
    private readonly _prismaConstants: typeof databaseErrorCode,
    private readonly _sharedService: SharedService,
  ) {}

  async createLike(user: User, { postId }: CreateLikeInputArgs): Promise<SuccessOutput> {
    try {
      await this._prismaService.like.create({
        data: { user: { connect: { id: user.id } }, post: { connect: { id: postId } } },
      });
      return this._sharedService.successResponse();
    } catch (error) {
      if (error.code === this._prismaConstants.CONSTRAINT.UNIQUE) {
        throw new ConflictException('already existed like');
      }
      throw new InternalServerErrorException(error);
    }
  }

  async deleteLike({ id }: DeleteLikeInputArgs): Promise<SuccessOutput> {
    await this._prismaService.like.delete({ where: { id } });
    return this._sharedService.successResponse();
  }
}
