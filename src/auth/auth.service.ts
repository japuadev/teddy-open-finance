import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/interfaces/dto/create.user.dto';
import * as bcrypt from 'bcrypt';
import { IUser } from 'src/user/interfaces/user.interface';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string } | undefined> {
    const user = await this.userService.findOne(email);

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const isPasswordValid = await bcrypt.compare(pass, user?.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Usário ou senha inválidos');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(payload: CreateUserDto): Promise<IUser> {
    const user = await this.userService.create(payload);
    return user;
  }
}
