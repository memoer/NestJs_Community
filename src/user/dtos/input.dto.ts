import { ArgsType, PickType, PartialType } from '@nestjs/graphql';
import { UserModel } from '../models/user.model';

@ArgsType()
export class CreateUserArgs extends PickType(
  UserModel,
  ['name', 'email', 'password', 'role'],
  ArgsType,
) {}

@ArgsType()
export class UpdateUserArgs extends PickType(
  PartialType(UserModel),
  ['name', 'email', 'password', 'role'],
  ArgsType,
) {}

@ArgsType()
export class LoginArgs extends PickType(UserModel, ['email', 'password'], ArgsType) {}
