import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { OutputGql } from '~/_shared/dtos/output.dto';
import { UserModel } from './models/user.model';
import { UserService } from './user.service';
import { UserIdArgs, CreateUserArgs, UpdateUserArgs, LoginArgs } from './dtos/input.dto';
import { GetUserListOutputGql, GetUserOneOutputGql, LoginOutputGql } from './dtos/output.dto';
import { AuthUser } from '~/auth/user.decorator';
import { Roles } from '~/auth/roles.decorator';
import { Paginated } from '~/_shared/dtos/input.dto';

@Resolver(of => UserModel)
export class UserResolver {
  constructor(private readonly _userService: UserService) {}

  @Query(returns => LoginOutputGql)
  login(@Args() args: LoginArgs): Promise<string> {
    return this._userService.login(args);
  }

  @Query(returns => GetUserOneOutputGql)
  @Roles('ANY')
  getMe(@AuthUser() user: User): User {
    return user;
  }

  @Query(returns => GetUserOneOutputGql)
  getUserOne(@Args() args: UserIdArgs): Promise<User> {
    return this._userService.getUserOne(args);
  }

  @Query(returns => GetUserListOutputGql)
  getUserList(@Args() args: Paginated): Promise<User[]> {
    // console.log(args);
    return this._userService.getUserList(args);
  }

  @Mutation(returns => OutputGql)
  createUser(@Args() args: CreateUserArgs): Promise<User> {
    return this._userService.createUser(args);
  }

  @Mutation(returns => OutputGql)
  @Roles('ANY')
  updateUser(@AuthUser() user: User, @Args() args: UpdateUserArgs): Promise<User> {
    return this._userService.updateUser(user, args);
  }

  @Mutation(returns => OutputGql)
  @Roles('ANY')
  deleteUser(@AuthUser() user: User): Promise<User> {
    return this._userService.deleteUser(user);
  }
}
