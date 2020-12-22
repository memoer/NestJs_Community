import { ObjectType, Int, Field } from '@nestjs/graphql';
import { IsNumber, IsPositive, IsString } from 'class-validator';
import { getListOutput } from '~/_shared/dtos/output.dto';
import { UserModel } from '../models/user.model';

@ObjectType()
export class GetUserListOutputGql extends getListOutput(UserModel) {}

@ObjectType()
export class NotifyToUserOutputGql {
  @Field(type => Int)
  @IsNumber()
  @IsPositive()
  userId: number;

  @Field(type => String)
  @IsString()
  message: string;
}
