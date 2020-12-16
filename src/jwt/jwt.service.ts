import { Injectable, Inject } from '@nestjs/common';
import { User } from '@prisma/client';
import { ConfigType } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import appConfig from '~/_config/app.config';

@Injectable()
export class JwtService {
  constructor(@Inject(appConfig.KEY) private readonly _appConfig: ConfigType<typeof appConfig>) {}
  sign(userId: User['id']): string {
    return jwt.sign({ id: userId }, this._appConfig.secretKey);
  }
  verify(token: string): string | Record<string, any> {
    return jwt.verify(token, this._appConfig.secretKey);
  }
}
