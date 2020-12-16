import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class Paginated {
  @Field(type => Int, { nullable: true, defaultValue: 0 })
  skip?: number;
  @Field(type => Int, { nullable: true, defaultValue: 10 })
  take?: number;
}
