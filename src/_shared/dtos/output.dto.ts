import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { IsNumber, IsPositive, IsArray, ValidateNested } from 'class-validator';
import { Type as TransformerType } from 'class-transformer';

export function getOutputGql<T>(classRef: Type<T> | Type<T>[]): any {
  const options: Parameters<typeof Field>['1'] = Array.isArray(classRef)
    ? { nullable: 'items' }
    : undefined;
  @ObjectType({ isAbstract: true })
  abstract class A {
    @Field(type => classRef, options)
    data?: typeof classRef extends [] ? T[] : T;
  }
  return A;
}
@ObjectType()
export class SuccessOutput {
  @Field(type => Boolean)
  ok: boolean;
}

export interface GetListOutput<T> {
  data: T[];
  count: number;
  page: number;
  take: number;
}
export function getListOutput<T>(classRef: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class A {
    @Field(type => [classRef])
    @IsArray()
    @ValidateNested({ each: true })
    @TransformerType(() => classRef)
    data: T[];
    @Field(type => Int)
    @IsNumber()
    @IsPositive()
    count: number;
    @Field(type => Int)
    @IsNumber()
    @IsPositive()
    page: number;
    @Field(type => Int)
    @IsNumber()
    @IsPositive()
    take: number;
  }
  return A;
}
