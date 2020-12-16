import { ArgsType, Field, Int, IntersectionType } from '@nestjs/graphql';
import { IsOptional, IsNumber, IsPositive, IsBoolean } from 'class-validator';

@ArgsType()
export class PaginatedArgs {
  @Field(type => Int, { nullable: true, defaultValue: 1 })
  @IsOptional()
  page?: number;
  @Field(type => Int, { nullable: true, defaultValue: 10 })
  @IsOptional()
  take?: number;
}

@ArgsType()
export class IncludeArgs {
  @Field(type => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  include?: boolean;
}

@ArgsType()
export class GetOneArgs {
  @Field(type => Int)
  @IsNumber()
  @IsPositive()
  id: number;
}

@ArgsType()
export class PaginatedIncludeArgs extends IntersectionType(PaginatedArgs, IncludeArgs, ArgsType) {}

@ArgsType()
export class GetOneIncludeArgs extends IntersectionType(GetOneArgs, IncludeArgs, ArgsType) {}
