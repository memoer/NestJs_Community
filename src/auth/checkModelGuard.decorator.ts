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

type WhatCheck = 'MINE' | 'EXISTS';

interface MetaDataValue
  extends Record<
    Exclude<keyof typeof sharedConstants['META_DATA']['KEY'], 'ROLES' | 'WHAT_CHECK'>,
    string
  > {
  readonly WHAT_CHECK: WhatCheck;
}

@Injectable()
class CheckModelGuard implements CanActivate {
  constructor(
    private readonly _reflector: Reflector,
    private readonly _prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { KEY } = sharedConstants.META_DATA;
    const gqlCtx = GqlExecutionContext.create(context).getContext<GqlContext>();
    const { WHAT_MODEL, KEY_NAME_TO_CHECK, WHAT_CHECK } = Object.keys(KEY).reduce((obj, key) => {
      const value = this._reflector.get(key, context.getHandler());
      obj[key] = value;
      return obj;
    }, {}) as MetaDataValue;
    // check whether user logged in
    const { user } = gqlCtx;
    if (!user) throw new ForbiddenException('Please Log in'); // require login
    const post = await this._prismaService[WHAT_MODEL.toLowerCase()].findUnique({
      where: { id: context.getArgs()[1][KEY_NAME_TO_CHECK] },
    });
    // throw error if model is not exists
    if (!post) throw new NotFoundException(`${WHAT_MODEL} not found`);
    return WHAT_CHECK === 'EXISTS' || user.id === post.authorId;
  }
}

export function CheckModelOf(model: Prisma.ModelName, whatCheck: WhatCheck, keyNameToCheck = 'id') {
  const {
    KEY: { WHAT_MODEL, WHAT_CHECK, KEY_NAME_TO_CHECK },
  } = sharedConstants.META_DATA;
  return applyDecorators(
    SetMetadata(WHAT_MODEL, model),
    SetMetadata(WHAT_CHECK, whatCheck),
    SetMetadata(KEY_NAME_TO_CHECK, keyNameToCheck),
    UseGuards(CheckModelGuard),
  );
}
