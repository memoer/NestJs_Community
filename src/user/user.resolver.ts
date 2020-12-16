import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { GetUser } from '~/auth/user.decorator';
import { Roles } from '~/auth/roles.decorator';
import { PaginatedArgs, IncludeArgs, GetOneIncludeArgs } from '~/_shared/dtos/input.dto';
import { UserModel } from './models/user.model';
import { UserService } from './user.service';
import { CreateUserArgs, UpdateUserArgs, LoginArgs } from './dtos/input.dto';
import { GetUserListOutputGql } from './dtos/output.dto';
import { SuccessOutput, GetListOutput } from '~/_shared/dtos/output.dto';

@Resolver(of => UserModel)
export class UserResolver {
  constructor(private readonly _userService: UserService) {}
  @Query(returns => String)
  login(@Args() args: LoginArgs): Promise<string> {
    return this._userService.login(args);
  }
  @Query(returns => UserModel)
  @Roles('ANY')
  getMe(@GetUser() user: User, @Args() { include }: IncludeArgs): Promise<User> | User {
    return include ? this._userService.getMeWithRelation(user) : user;
  }
  @Query(returns => UserModel)
  getUserOne(@Args() args: GetOneIncludeArgs): Promise<User> {
    return this._userService.getUserOne(args);
  }
  @Query(returns => GetUserListOutputGql)
  getUserList(@Args() args: PaginatedArgs): Promise<GetListOutput<User>> {
    return this._userService.getUserList(args);
  }
  @Mutation(returns => UserModel)
  createUser(@Args() args: CreateUserArgs): Promise<User> {
    return this._userService.createUser(args);
  }
  @Mutation(returns => SuccessOutput)
  @Roles('ANY')
  deleteUser(@GetUser() user: User): Promise<SuccessOutput> {
    return this._userService.deleteUser(user);
  }
  @Mutation(returns => UserModel)
  @Roles('ANY')
  updateUser(@GetUser() user: User, @Args() args: UpdateUserArgs): Promise<User> {
    return this._userService.updateUser(user, args);
  }
}
