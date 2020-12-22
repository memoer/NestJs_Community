import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class MessageService {
  getMsgOnLikeInSubscription(user: User): string {
    return `${user.name} 님이 좋아요를 클릭했습니다.`;
  }
  getMsgOnCommentInSubscription(user: User): string {
    return `${user.name} 님이 댓글을 달았습니다.`;
  }
}
