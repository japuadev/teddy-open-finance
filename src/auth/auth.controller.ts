import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { Public } from 'src/auth/decorators/public.decorator';

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
