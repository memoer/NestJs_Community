import { SetMetadata } from '@nestjs/common';
import { UserRole } from '~/user/models/user.model';
import sharedConstants from '~/_shared/shared.constants';

export type AllowedRoles = keyof typeof UserRole | typeof sharedConstants.META_DATA.VALUE.ANY;
export const Roles = (...args: AllowedRoles[]) =>
  SetMetadata(sharedConstants.META_DATA.KEY.ROLES, args);
