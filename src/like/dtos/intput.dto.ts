import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsPositive } from 'class-validator';

@ArgsType()
export class CreateLikeInputArgs {
  @Field(type => Int)
  @IsNumber()
  @IsPositive()
  postId: number;
}

@ArgsType()
export class DeleteLikeInputArgs {
  @Field(type => Int)
  @IsNumber()
  @IsPositive()
  id: number;
}
