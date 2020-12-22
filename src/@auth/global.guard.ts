import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { META_DATA } from '~/@shared/shared.constants';
import { ReturnedContext } from '~/@graphql/graphql.factory';
import { AllowedRoles } from './roles.decorator';
import { AuthService } from './auth.service';

@Injectable()
export class GlobalGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector, private readonly _authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const {
      KEY: { ROLES },
      VALUE: { ANY },
    } = META_DATA;
    const roles = this._reflector.get<AllowedRoles>(ROLES, context.getHandler());
    // public
    if (!roles) return true;
    const gqlCtx = GqlExecutionContext.create(context).getContext<ReturnedContext>();
    const user = await this._authService.getUser(gqlCtx);
    // should login
    if (!user) return false;
    if (roles.includes(ANY)) return true;
    return roles.includes(user.role);
  }
}
