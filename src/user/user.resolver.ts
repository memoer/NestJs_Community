import {
  Resolver,
  Mutation,
  Query,
  Args,
  Subscription,
  ResolveField,
  Int,
  Parent,
} from '@nestjs/graphql';
import { User } from '@prisma/client';
import { GetUser } from '~/@auth/user.decorator';
import { Roles } from '~/@auth/roles.decorator';
import { PaginatedArgs, IncludeArgs, GetOneIncludeArgs } from '~/@shared/dtos/input.dto';
import { GetListOutput } from '~/@shared/dtos/output.dto';
import { UserModel } from './models/user.model';
import { UserService } from './user.service';
import { CreateUserArgs, UpdateUserArgs, LoginArgs } from './dtos/input.dto';
import { GetUserListOutputGql, NotifyToUserOutputGql } from './dtos/output.dto';
import { PubsubService } from '~/@pubsub/pubsub.service';
import { NotifyToUserPayload } from './user.interface';
import { notifyToUserResolve, notifyToUserFilter } from './lib/utils';
import { NotificationService } from '~/notification/notification.service';

@Resolver(of => UserModel)
export class UserResolver {
  constructor(
    private readonly _userService: UserService,
    private readonly _pubsubService: PubsubService,
    private readonly _notificationService: NotificationService,
  ) {}

  @ResolveField(type => Int)
  notificationCount(@Parent() data: User): Promise<number> {
    return this._userService.notificationCount(data.id);
  }

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

  @Mutation(returns => Boolean)
  @Roles('ANY')
  deleteUser(@GetUser() user: User): Promise<boolean> {
    return this._userService.deleteUser(user);
  }

  @Mutation(returns => UserModel)
  @Roles('ANY')
  updateUser(@GetUser() user: User, @Args() args: UpdateUserArgs): Promise<User> {
    return this._userService.updateUser(user, args);
  }

  @Subscription(returns => NotifyToUserOutputGql, {
    filter: notifyToUserFilter,
  })
  @Roles('ANY')
  notifyToUser(@GetUser() user: User) {
    return this._pubsubService
      .getPubsub()
      .asyncIterator(PubsubService.VALUES.NOTIFY_TO_USER.TRIGGER)
      .next()
      .then(({ value }: { value: NotifyToUserPayload }) => {
        const { info } = value.notifyToUser;
        const myInfo = Array.isArray(info) ? info.find(v => v.id === user.id) : info;
        // checked -> true
        this._notificationService.checkedNotification({ id: myInfo.notificationId });
        return notifyToUserResolve(value, user);
      });
  }
}
