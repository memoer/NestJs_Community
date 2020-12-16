import { Injectable } from '@nestjs/common';
import { PrismaService } from '~/_database/database.service';
import { Post, User, Prisma } from '@prisma/client';
import { CreatePostArgs, UpdatePostArgs } from './dtos/input.dto';
import { PaginatedIncludeArgs, GetOneIncludeArgs, GetOneArgs } from '~/_shared/dtos/input.dto';
import { SharedService } from '~/_shared/shared.service';
import { GetListOutput, SuccessOutput } from '~/_shared/dtos/output.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _sharedService: SharedService,
  ) {}
  private _getIncludeObject(include: boolean) {
    return include ? { include: { comments: true } } : undefined;
  }
  async getMyPost(
    user: User,
    { include, ...args }: PaginatedIncludeArgs,
  ): Promise<GetListOutput<Post>> {
    return this._sharedService.getFindMany<Post, Prisma.PostInclude>({
      model: 'Post',
      where: { authorId: user.id },
      ...this._getIncludeObject(include),
      ...args,
    });
  }
  async getPostOne({ id, include }: GetOneIncludeArgs): Promise<Post> {
    return this._prismaService.post.findOne({
      where: { id },
      ...this._getIncludeObject(include),
    });
  }
  async getPostList({ include, ...args }: PaginatedIncludeArgs): Promise<GetListOutput<Post>> {
    return this._sharedService.getFindMany<Post, Prisma.PostInclude>({
      model: 'Post',
      ...this._getIncludeObject(include),
      ...args,
    });
  }
  async createPost(user: User, args: CreatePostArgs): Promise<Post> {
    return this._prismaService.post.create({
      data: {
        ...args,
        author: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }
  async deletePost({ id }: GetOneArgs): Promise<SuccessOutput> {
    await this._prismaService.post.delete({ where: { id } });
    return { ok: true };
  }
  async updatePost({ id, ...data }: UpdatePostArgs): Promise<Post> {
    return this._prismaService.post.update({ where: { id }, data });
  }
}
