import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { IUser } from 'src/user/interfaces/user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, passowrd: string) {
    const user = await this.prisma.users.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Usuário ainda não tem cadastro.');
    }

    const validPass = await bcrypt.compare(passowrd, user.password);
    if (!validPass) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };

    const token = this.jwtService.sign(payload);
    return {
      token,
      user: payload.user,
    };
  }

  async signUp(payload: CreateUserDto): Promise<IUser> {
    const user = await this.userService.create(payload);
    return user;
  }
}
