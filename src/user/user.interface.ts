import { PubsubService } from '~/@pubsub/pubsub.service';

export interface NotifyToUserPublishData {
  userIdList: number[];
  message: string;
}
export type NotifyToUserPayload = Record<
  typeof PubsubService.VALUES.NOTIFY_TO_USER.METHOD_NAME,
  NotifyToUserPublishData
>;
