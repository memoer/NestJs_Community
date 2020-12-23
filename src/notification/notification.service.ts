import { Injectable } from '@nestjs/common';
import { Notification, User, Prisma } from '@prisma/client';
import { PrismaService } from '~/@database/database.service';
import { SharedService } from '~/@shared/shared.service';
import {
  CreateNotificationParams,
  UpdateNotificationParams,
  CheckedNotificationArgs,
} from './dtos/input.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _sharedService: SharedService,
  ) {}

  async checkedNotification({ id }: CheckedNotificationArgs): Promise<Notification> {
    return this._prismaService.notification.update({ where: { id }, data: { checked: true } });
  }

  async checkAllNotification(whoId: User['id']): Promise<Prisma.BatchPayload> {
    return this._prismaService.notification.updateMany({
      where: { whoId, checked: false },
      data: { checked: true },
    });
  }

  async createNotification({ whoId, content }: CreateNotificationParams): Promise<Notification> {
    return this._prismaService.notification.create({
      data: { content, checked: false, who: { connect: { id: whoId } } },
    });
  }

  async updateNotification({ id, ...obj }: UpdateNotificationParams): Promise<Notification> {
    const updateObj = this._sharedService.stripObject(obj);
    return this._prismaService.notification.update({ where: { id }, data: updateObj });
  }
}
