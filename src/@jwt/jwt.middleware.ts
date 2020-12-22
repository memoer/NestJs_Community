import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { ContextParams } from '~/@graphql/graphql.factory';
import { JWT_HEADER_NAME } from './jwt.constants';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly _jwtService: JwtService) {}
  async use(req: ContextParams['req'], res: Response, next: NextFunction) {
    if (JWT_HEADER_NAME in req.headers) {
      const token = req.headers[JWT_HEADER_NAME];
      const user = await this._jwtService.getUserUsingToken(token);
      if (user) req.user = user;
    }
    next();
  }
}
