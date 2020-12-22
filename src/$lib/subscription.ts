import { ReturnedContext } from '~/_graphql/graphql.factory';

export const compareWithCtxUser = (userId: number, ctx: ReturnedContext) => {
  const {
    user: { id },
  } = ctx;
  return userId === id;
};
