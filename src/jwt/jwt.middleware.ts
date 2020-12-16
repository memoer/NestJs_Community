import { Injectable, NestMiddleware } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '~/_database/database.service';
import { JwtService } from './jwt.service';

export interface CustomRequest extends Request {
  user: User;
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _prismaService: PrismaService,
  ) {}
  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const AUTHORIZATION = 'authorization';
    if (AUTHORIZATION in req.headers) {
      const token = req.headers[AUTHORIZATION];
      const payload = this._jwtService.verify(token);
      if (typeof payload === 'object' && 'id' in payload) {
        const user = await this._prismaService.user.findUnique({
          where: { id: Number((payload as { id: string }).id) },
        });
        req.user = user;
      }
    }
    next();
  }
}
