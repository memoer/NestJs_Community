import { ObjectType, Field, registerEnumType, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '@prisma/client';
import { PostModel } from '~/post/models/post.model';

export enum UserRole {
  STUDENT = 'STUDENT',
  MENTOR = 'MENTOR',
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserModelInputType', { isAbstract: true })
@ObjectType('UserModelObjectType')
export class UserModel implements User {
  @Field(type => Int)
  @IsNumber()
  @IsPositive()
  id: number;

  @Field(type => String)
  @IsString()
  name: string;

  @Field(type => String)
  @IsString()
  email: string;

  @Field(type => String)
  @IsString()
  password: string;

  @Field(type => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Field(type => [PostModel], { nullable: 'itemsAndList' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostModel)
  @IsOptional()
  posts?: PostModel[];
}
