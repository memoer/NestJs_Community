import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AllowedRoles } from './roles.decorator';
import sharedConstants from '~/_shared/shared.constants';
import { GqlContext } from '~/_graphql/graphql.factory';

@Injectable()
export class GlobalGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const {
      KEY: { ROLES },
      VALUE: { ANY },
    } = sharedConstants.META_DATA;
    const roles = this._reflector.getAllAndOverride<AllowedRoles>(ROLES, [context.getHandler()]);
    // public
    if (!roles) return true;
    const gqlCtx = GqlExecutionContext.create(context).getContext<GqlContext>();
    const { user } = gqlCtx;
    // should login
    if (!user) return false;
    if (roles.includes(ANY)) return true;
    return roles.includes(user.role);
  }
}
