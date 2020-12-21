import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ReturnedContext } from '~/_graphql/graphql.factory';

export const GetUser = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const MyGqlContext = GqlExecutionContext.create(context).getContext();
  const { user } = MyGqlContext as ReturnedContext;
  return user;
});
