import {
  applyDecorators,
  SetMetadata,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '~/_database/database.service';
import sharedConstants from '~/_shared/shared.constants';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from '~/_graphql/graphql.factory';

@Injectable()
class CheckModelOfGuard implements CanActivate {
  constructor(
    private readonly _reflector: Reflector,
    private readonly _prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const {
      KEY: { WHAT_MODEL, KEY_NAME_TO_CHECK },
    } = sharedConstants.META_DATA;
    const gqlCtx = GqlExecutionContext.create(context).getContext<GqlContext>();
    const whatModel = this._reflector.getAllAndOverride<Prisma.ModelName>(WHAT_MODEL, [
      context.getHandler(),
    ]);
    const keyNameToCheck = this._reflector.getAllAndOverride<string>(KEY_NAME_TO_CHECK, [
      context.getHandler(),
    ]);
    // check whether user logged in
    const { user } = gqlCtx;
    if (!user) throw new ForbiddenException('Please Log in'); // require login
    const post = await this._prismaService[whatModel.toLowerCase()].findUnique({
      where: { id: context.getArgs()[1][keyNameToCheck] },
    });
    // throw error if model is not exists
    if (!post) throw new NotFoundException(`${whatModel} not found`);
    return user.id === post.authorId;
  }
}

export function CheckModelOf(model: Prisma.ModelName, keyNameToCheck = 'id') {
  const {
    KEY: { WHAT_MODEL, KEY_NAME_TO_CHECK },
  } = sharedConstants.META_DATA;
  return applyDecorators(
    SetMetadata(WHAT_MODEL, model),
    SetMetadata(KEY_NAME_TO_CHECK, keyNameToCheck),
    UseGuards(CheckModelOfGuard),
  );
}
