import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';
import { Observable } from 'rxjs';
import { AllowedRoles, ROLES_KEY, ANY_TYPE } from './roles.decorator';

@Injectable()
export class GlobalGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this._reflector.getAllAndOverride<AllowedRoles>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // public
    if (!roles) return true;
    const ctx = GqlExecutionContext.create(context).getContext();
    const user: User = ctx['user'];
    // should login
    if (!user) return false;
    if (roles.includes(ANY_TYPE)) return true;
    return roles.includes(user.role);
  }
}
