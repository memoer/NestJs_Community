import { Resolver, Mutation } from '@nestjs/graphql';
import { Notification, User, Prisma } from '@prisma/client';
import { NotificationModel } from './models/notification.model';
import { NotificationService } from './notification.service';
import { CheckedNotificationArgs } from './dtos/input.dto';
import { CheckModelOf } from '~/@auth/checkModelGuard.decorator';
import { Roles } from '~/@auth/roles.decorator';
import { GetUser } from '~/@auth/user.decorator';
import { CheckedAllNotification } from './dtos/output.dto';

@Resolver(of => NotificationModel)
export class NotificationResolver {
  constructor(private readonly _notificationService: NotificationService) {}

  @Mutation(returns => NotificationModel)
  @CheckModelOf('Notification', 'MINE', 'whoId')
  chekcedNotification(args: CheckedNotificationArgs): Promise<Notification> {
    return this._notificationService.checkedNotification(args);
  }

  @Mutation(returns => CheckedAllNotification)
  @Roles('ANY')
  chekcedAllNotification(@GetUser() user: User): Promise<Prisma.BatchPayload> {
    return this._notificationService.checkAllNotification(user.id);
  }
}
