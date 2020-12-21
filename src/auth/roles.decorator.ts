import { SetMetadata } from '@nestjs/common';
import { UserRole } from '~/user/models/user.model';
import { META_DATA } from '~/_shared/shared.constants';

export type AllowedRoles = keyof typeof UserRole | typeof META_DATA.VALUE.ANY;
export const Roles = (...args: AllowedRoles[]) => SetMetadata(META_DATA.KEY.ROLES, args);
