import {
  applyDecorators,
  SetMetadata,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Prisma, Post, Notification } from '@prisma/client';
import { PrismaService } from '~/@database/database.service';
import { META_DATA } from '~/@shared/shared.constants';
import { ReturnedContext } from '~/@graphql/graphql.factory';
import { AuthService } from './auth.service';

type CheckType = 'MINE' | 'EXISTS';

interface MetaDataValue
  extends Record<Exclude<keyof typeof META_DATA['KEY'], 'ROLES' | 'CHECK_TYPE'>, string> {
  readonly CHECK_TYPE: CheckType;
}

@Injectable()
export class CheckModelGuard implements CanActivate {
  constructor(
    private readonly _reflector: Reflector,
    private readonly _prismaService: PrismaService,
    private readonly _authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { KEY } = META_DATA;
    const gqlCtx = GqlExecutionContext.create(context).getContext<ReturnedContext>();
    const { MODEL, CHECK_TYPE, ARGUMENT_ID_NAME, CHECK_ID_NAME } = Object.keys(KEY).reduce(
      (obj, key) => {
        const value = this._reflector.get(key, context.getHandler());
        obj[key] = value;
        return obj;
      },
      {},
    ) as MetaDataValue;
    // check whether user logged in
    const user = await this._authService.getUser(gqlCtx);
    if (!user) throw new ForbiddenException('Please Log in'); // require login
    const data = await this._prismaService[MODEL.toLowerCase()].findUnique({
      where: { id: context.getArgs()[1][ARGUMENT_ID_NAME] },
    });
    // throw error if model is not exists
    if (!data) throw new NotFoundException(`${MODEL} not found`);
    return CHECK_TYPE === 'EXISTS' || user.id === data[CHECK_ID_NAME];
  }
}

type CheckIdName = Extract<keyof Post, 'authorId'> | Extract<keyof Notification, 'whoId'>;
export function CheckModelOf(
  model: Prisma.ModelName,
  checkType: CheckType,
  checkIdName: CheckIdName,
  argumentIdName = 'id',
) {
  const {
    KEY: { MODEL, CHECK_TYPE, CHECK_ID_NAME, ARGUMENT_ID_NAME },
  } = META_DATA;
  return applyDecorators(
    SetMetadata(MODEL, model),
    SetMetadata(CHECK_TYPE, checkType),
    SetMetadata(CHECK_ID_NAME, checkIdName),
    SetMetadata(ARGUMENT_ID_NAME, argumentIdName),
    UseGuards(CheckModelGuard),
  );
}
