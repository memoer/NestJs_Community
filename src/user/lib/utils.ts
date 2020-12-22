import { ReturnedContext } from '~/@graphql/graphql.factory';
import { NotifyToUserPayload } from '../user.interface';

// 1. util성 함수이지만 global하게 사용하지 않을 것 같아서 user module 내부에 만들었음
// 2. user module 내부에 만들지 않고 따로 뺸 이유는 notifyToUser subscription resolve 함수에 사용하기 위함
//    - 해당 클래스 내부에 함수를 선언하면 함수를 못 불러옴
//    - 그래서 외부로 빼 놓은 상황
export const notifyToUserResolve = (
  { notifyToUser }: NotifyToUserPayload,
  _,
  context: ReturnedContext,
) => {
  const { userIdList, message } = notifyToUser;
  const { id } = context.user;
  return {
    userId: userIdList.find(v => v === id),
    message,
  };
};
