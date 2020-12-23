import { PartialType, PickType, ArgsType } from '@nestjs/graphql';
import { NotificationModel } from '../models/notification.model';
import { IsNumber, IsPositive } from 'class-validator';

@ArgsType()
export class CheckedNotificationArgs extends PickType(NotificationModel, ['id'], ArgsType) {}

export class CreateNotificationParams extends PickType(NotificationModel, ['whoId', 'message']) {}

export class UpdateNotificationParams extends PickType(PartialType(NotificationModel), [
  'message',
  'checked',
]) {
  @IsNumber()
  @IsPositive()
  id: number;
}
