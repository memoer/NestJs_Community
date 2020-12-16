import { ObjectType } from '@nestjs/graphql';
import { getListOutput } from '~/_shared/dtos/output.dto';
import { UserModel } from '../models/user.model';

@ObjectType()
export class GetUserListOutputGql extends getListOutput(UserModel) {}
