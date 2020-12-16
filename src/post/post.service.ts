import { Injectable } from '@nestjs/common';
import { PrismaService } from '~/_database/database.service';
import { Post, User } from '@prisma/client';
import { PostIdArgs, CreatePostArgs } from './dtos/input.dto';

@Injectable()
export class PostService {
  constructor(private readonly _prismaService: PrismaService) {}
  async getMyPost(user: User): Promise<Post[]> {
    return this._prismaService.post.findMany({ where: { author: user } });
  }

  async getPostOne({ id }: PostIdArgs): Promise<Post> {
    return this._prismaService.post.findOne({ where: { id } });
  }

  async getPostList(): Promise<Post[]> {
    return this._prismaService.post.findMany();
  }

  async createPost(user: User, args: CreatePostArgs): Promise<Post> {
    const a = await this._prismaService.post.create({
      data: {
        ...args,
        author: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    console.log(a);
    return a;
  }
}
