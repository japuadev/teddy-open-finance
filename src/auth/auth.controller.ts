import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/interfaces/dto/create.user.dto';
import { SignInDto } from './interfaces/dto/sign.in.dto';
import { Public } from 'src/auth/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto.email, dto.pass);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  signUp(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }
}
