import { SetMetadata } from '@nestjs/common';
import { UserRole } from '~/user/models/user.model';

export const ANY_TYPE = 'ANY';
export type AllowedRoles = keyof typeof UserRole | typeof ANY_TYPE;
export const ROLES_KEY = 'roles';
export const Roles = (...args: AllowedRoles[]) => SetMetadata(ROLES_KEY, args);
