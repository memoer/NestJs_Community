import { Notification } from '@prisma/client';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsPositive, IsString, IsBoolean, IsDate } from 'class-validator';

@ObjectType()
export class NotificationModel implements Notification {
  @Field(type => Int)
  @IsNumber()
  @IsPositive()
  id: number;

  @Field(type => Int)
  @IsNumber()
  @IsPositive()
  whoId: number;

  @Field(type => String)
  @IsString()
  content: string;

  @Field(type => Boolean)
  @IsBoolean()
  checked: boolean;

  @Field(type => Date)
  @IsDate()
  createdAt: Date;
}
