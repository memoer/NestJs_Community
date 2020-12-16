import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { MyContext } from '~/_graphql/graphql.factory';

export const AuthUser = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const gqlContext = GqlExecutionContext.create(context).getContext();
  const { user } = gqlContext as MyContext;
  return user;
});
