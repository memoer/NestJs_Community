import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import appConfig from '~/_config/app.config';
import { PrismaService } from '~/_database/database.service';

@Injectable()
export class JwtService {
  constructor(
    @Inject(appConfig.KEY) private readonly _appConfig: ConfigType<typeof appConfig>,
    private readonly _prismaService: PrismaService,
  ) {}
  sign(userId: User['id']): string {
    return jwt.sign({ id: userId }, this._appConfig.secretKey);
  }
  verify(token: string): string | Record<string, any> {
    return jwt.verify(token, this._appConfig.secretKey);
  }
  async getUserUsingToken(token: string): Promise<User | null> {
    const payload = this.verify(token);
    if (typeof payload !== 'object' || !('id' in payload)) return null;
    const user = await this._prismaService.user.findUnique({
      where: { id: Number((payload as { id: string }).id) },
    });
    return user;
  }
}
