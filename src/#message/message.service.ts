import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

export type PublishType = 'like' | 'comment';

@Injectable()
export class MessageService {
  getMsgInSubscription(user: User, publishType: PublishType) {
    switch (publishType) {
      case 'like':
        return `${user.name} 님이 좋아요를 클릭했습니다.`;
      case 'comment':
        return `${user.name} 님이 댓글을 달았습니다.`;
    }
  }
}
