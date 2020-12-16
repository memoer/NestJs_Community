import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from '~/_graphql/graphql.factory';

export const GetUser = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const gqlContext = GqlExecutionContext.create(context).getContext();
  const { user } = gqlContext as GqlContext;
  return user;
});
