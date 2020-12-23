import { Injectable, ExecutionContext, NotFoundException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '~/@database/database.service';
import { ReturnedContext } from '~/@graphql/graphql.factory';
import { GetListOutput } from './dtos/output.dto';
interface GetFindManyParams<I> {
  model: Prisma.ModelName;
  page?: number;
  take?: number;
  include?: I;
  where?: Record<string, string | number>;
}

@Injectable()
export class SharedService {
  private readonly _saltOrRounds = 10;

  constructor(private readonly _prismaService: PrismaService) {}

  generateHash(plainString: string): Promise<string> {
    return bcrypt.hash(plainString, this._saltOrRounds);
  }

  comapreHashWithPlain(plainString: string, hash: string): boolean {
    return bcrypt.compareSync(plainString, hash);
  }

  getSkip({ page, take }: { page: number; take: number }): number {
    return (page - 1) * take;
  }

  async getFindMany<R, I = undefined>({
    model,
    page,
    include,
    ...options
  }: GetFindManyParams<I>): Promise<GetListOutput<R>> {
    const lowerModel = model.toLowerCase();
    const data = await this._prismaService[lowerModel].findMany({
      skip: (page - 1) * options.take,
      include,
      ...options,
    });
    const count = await this._prismaService[lowerModel].count();
    return { data, count, page: page, take: options.take };
  }

  getMyInfoThroughCtx(context: ExecutionContext): User {
    const me = GqlExecutionContext.create(context).getContext<ReturnedContext>().user;
    if (!me)
      throw new NotFoundException('[pubsub.interceptor]_getMyInfo: user(me) not found Error');
    return me;
  }

  stripObject(obj: Record<string, any>) {
    return Object.keys(obj).reduce((strippedObj, key) => {
      if (obj[key]) {
        strippedObj[key] = obj[key];
      }
      return strippedObj;
    }, {});
  }
}
