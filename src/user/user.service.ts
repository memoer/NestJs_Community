import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '~/_database/database.service';
import { JwtService } from '~/jwt/jwt.service';
import { SharedService } from '~/_shared/shared.service';
import { UserIdArgs, CreateUserArgs, UpdateUserArgs, LoginArgs } from './dtos/input.dto';
import { Paginated } from '~/_shared/dtos/input.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _jwtService: JwtService,
    private readonly _sharedService: SharedService,
  ) {}

  async login({ email, password }: LoginArgs) {
    const user = await this._prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    if (!this._sharedService.checkHashWithPlain(password, user.password))
      throw new UnauthorizedException('Password is wrong');
    return this._jwtService.sign(user.id);
  }

  async getUserOne({ id }: UserIdArgs): Promise<User> {
    return this._prisma.user.findUnique({ where: { id } });
  }

  async getUserList({ skip, take }: Paginated): Promise<User[]> {
    return this._prisma.user.findMany();
  }

  async createUser(data: CreateUserArgs): Promise<User> {
    const { password, ...rest } = data;
    const hashPassword = await this._sharedService.generateHash(password);
    return this._prisma.user.create({
      data: {
        password: hashPassword,
        ...rest,
      },
    });
  }

  async updateUser(user: User, { id, ...data }: UpdateUserArgs): Promise<User> {
    return this._prisma.user.update({ where: { id: user.id }, data });
  }

  async deleteUser(user: User): Promise<User> {
    return this._prisma.user.delete({ where: { id: user.id } });
  }
}
