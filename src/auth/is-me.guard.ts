import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '@prisma/client';

@Injectable()
export class IsMeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const user: User = ctx['user'];
    const { id } = context.getArgs()[1];
    return user.id === id;
  }
}
