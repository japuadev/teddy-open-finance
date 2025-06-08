import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { ResponseUserDto } from 'src/user/dtos/response-user.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastra usuário e retorna os dados desse usuário.' })
  @ApiResponse({
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 400, description: 'Erro ao criar usuário.' })
  @Post('/signup')
  async signUp(@Body() createDto: CreateUserDto): Promise<ResponseUserDto> {
    const user = await this.authService.signUp(createDto);

    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realiza o login e retorna um token JWT.' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '5219dfad...',
          email: 'joao@teddy360.com.br',
          role: 'ADMIN',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  signIn(@Body() signDto: SignInDto): Promise<IJwtPayload> {
    return this.authService.signIn(signDto.email, signDto.password);
  }
}
