import { PubsubService } from '~/@pubsub/pubsub.service';

export interface NotifyToUserPublishData_Info {
  id: number;
  notificationId: number;
}
export interface NotifyToUserPublishData {
  info: NotifyToUserPublishData_Info | NotifyToUserPublishData_Info[];
  message: string;
}
export type NotifyToUserPayload = Record<
  typeof PubsubService.VALUES.NOTIFY_TO_USER.METHOD_NAME,
  NotifyToUserPublishData
>;
