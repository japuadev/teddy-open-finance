import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public-strategy';
import { CreateUserDto } from 'src/user/interfaces/dto/create.user.dto';
import { SignInDto } from './interfaces/dto/sign.in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body.email, body.pass);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/signup')
  signUp(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }
}
