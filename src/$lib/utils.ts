import { ReturnedContext } from '~/@graphql/graphql.factory';

interface CompareWithCtxUser {
  (userId: number, ctx: ReturnedContext): boolean;
  (userId: number[], ctx: ReturnedContext): boolean;
}

// global하게 사용할 가능성이 있어보여 global lib 에 만들었음
// module 내부에 만들지 않고 따로 뺸 이유는 notifyToUser subscription filter 함수에 사용하기 위함
//    - 해당 클래스 내부에 함수를 선언하면 함수를 못 불러옴
//    - 그래서 외부로 빼 놓은 상황
export const compareWithCtxUser: CompareWithCtxUser = (userId, ctx) => {
  const {
    user: { id },
  } = ctx;
  if (Array.isArray(userId)) return userId.includes(id);
  return userId === id;
};
