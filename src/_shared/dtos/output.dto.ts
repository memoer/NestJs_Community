import { ObjectType, Field } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

@ObjectType()
export class OutputGql {
  @Field(type => Boolean)
  ok: boolean;
  @Field(type => String)
  error?: string;
}

export function getOutputGql<T>(classRef: Type<T> | Type<T>[]): any {
  const options: Parameters<typeof Field>['1'] = Array.isArray(classRef)
    ? { nullable: 'items' }
    : undefined;
  @ObjectType({ isAbstract: true })
  abstract class A extends OutputGql {
    @Field(type => classRef, options)
    data?: typeof classRef extends [] ? T[] : T;
  }
  return A;
}
