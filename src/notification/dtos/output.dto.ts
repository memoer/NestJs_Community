import { Prisma } from '@prisma/client';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CheckedAllNotification implements Prisma.BatchPayload {
  @Field(type => Int)
  count: number;
}
