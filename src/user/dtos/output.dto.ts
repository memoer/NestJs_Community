import { ObjectType } from '@nestjs/graphql';
import { UserModel } from '../models/user.model';
import { getOutputGql } from '~/_shared/dtos/output.dto';

@ObjectType()
export class LoginOutputGql extends getOutputGql(String) {}

@ObjectType()
export class GetUserOneOutputGql extends getOutputGql(UserModel) {}

@ObjectType()
export class GetUserListOutputGql extends getOutputGql([UserModel]) {}
