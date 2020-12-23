import { ReturnedContext } from '~/@graphql/graphql.factory';
import { NotifyToUserPayload } from '../user.interface';

export const notifyToUserFilter = (
  { notifyToUser }: NotifyToUserPayload,
  _,
  ctx: ReturnedContext,
) => {
  const { info } = notifyToUser;
  const { id } = ctx.user;
  return Array.isArray(info) ? info.some(v => v.id === id) : info.id === id;
};

// 1. util성 함수이지만 global하게 사용하지 않을 것 같아서 user module 내부에 만들었음
// 2. user module 내부에 만들지 않고 따로 뺸 이유는 notifyToUser subscription resolve 함수에 사용하기 위함
//    - 해당 클래스 내부에 함수를 선언하면 함수를 못 불러옴
//    - 그래서 외부로 빼 놓은 상황
export const notifyToUserResolve = (
  { notifyToUser }: NotifyToUserPayload,
  _,
  context: ReturnedContext,
) => {
  const { info, message } = notifyToUser;
  const { user } = context;
  const data = Array.isArray(info) ? info.find(v => v.id === user.id) : info;
  return {
    ...data,
    message,
  };
};

export const withCancel = (asyncIterator, onCancel) => {
  const asyncReturn = asyncIterator.return;

  asyncIterator.return = () => {
    onCancel();
    return asyncReturn
      ? asyncReturn.call(asyncIterator)
      : Promise.resolve({ value: undefined, done: true });
  };

  return asyncIterator;
};
