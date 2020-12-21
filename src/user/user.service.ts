import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '~/_database/database.service';
import { JwtService } from '~/jwt/jwt.service';
import { SharedService } from '~/_shared/shared.service';
import { PaginatedArgs, GetOneIncludeArgs } from '~/_shared/dtos/input.dto';
import { SuccessOutput, GetListOutput } from '~/_shared/dtos/output.dto';
import { CreateUserArgs, UpdateUserArgs, LoginArgs } from './dtos/input.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _jwtService: JwtService,
    private readonly _sharedService: SharedService,
  ) {}

  private _getIncludeObject(include: boolean) {
    return include ? { include: { posts: true } } : undefined;
  }

  async login({ email, password }: LoginArgs) {
    const user = await this._prismaService.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    if (!this._sharedService.comapreHashWithPlain(password, user.password))
      throw new UnauthorizedException('Password is wrong');
    return this._jwtService.sign(user.id);
  }

  async getMeWithRelation(user: User): Promise<User> {
    return this._prismaService.user.findUnique({
      where: { id: user.id },
      include: { posts: true },
    });
  }

  async getUserOne({ id, include }: GetOneIncludeArgs): Promise<User> {
    return this._prismaService.user.findUnique({
      where: { id },
      ...this._getIncludeObject(include),
    });
  }

  async getUserList({ page, take }: PaginatedArgs): Promise<GetListOutput<User>> {
    return this._sharedService.getFindMany<User>({ model: 'User', page, take });
  }

  async createUser(data: CreateUserArgs): Promise<User> {
    const { password, ...rest } = data;
    const hashPassword = await this._sharedService.generateHash(password);
    return this._prismaService.user.create({
      data: {
        password: hashPassword,
        ...rest,
      },
    });
  }

  async deleteUser(user: User): Promise<SuccessOutput> {
    await this._prismaService.user.delete({ where: { id: user.id } });
    return this._sharedService.successResponse();
  }

  async updateUser(user: User, data: UpdateUserArgs): Promise<User> {
    return this._prismaService.user.update({ where: { id: user.id }, data });
  }
}
