import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { PrismaService } from '~/_database/database.service';
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

  public successResponse() {
    return { ok: true };
  }

  public generateHash(plainString: string): Promise<string> {
    return bcrypt.hash(plainString, this._saltOrRounds);
  }
  public comapreHashWithPlain(plainString: string, hash: string): boolean {
    return bcrypt.compareSync(plainString, hash);
  }
  public getSkip({ page, take }: { page: number; take: number }): number {
    return (page - 1) * take;
  }
  public async getFindMany<R, I = undefined>({
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
}
