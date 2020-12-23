import { ObjectType, Int, Field } from '@nestjs/graphql';
import { IsNumber, IsString, IsPositive } from 'class-validator';
import { getListOutput } from '~/@shared/dtos/output.dto';
import { UserModel } from '../models/user.model';

@ObjectType()
export class GetUserListOutputGql extends getListOutput(UserModel) {}

@ObjectType()
export class NotifyToUserOutputGql {
  @Field(type => Int)
  @IsNumber()
  @IsPositive()
  id: number;

  @Field(type => Int)
  @IsNumber()
  @IsPositive()
  notificationId;

  @Field(type => String)
  @IsString()
  message: string;
}
