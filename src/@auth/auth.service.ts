import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ReturnedContext } from '~/@graphql/graphql.factory';
import { JwtService } from '~/@jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(private readonly _jwtService: JwtService) {}
  async getUser(gqlCtx: ReturnedContext): Promise<User> {
    if (gqlCtx.user) return gqlCtx.user;
    const u = await this._jwtService.getUserUsingToken(gqlCtx.token);
    gqlCtx.user = u;
    return u;
  }
}
