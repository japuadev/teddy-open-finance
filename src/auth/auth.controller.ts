import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastra usuário e retorna os dados desse usuário.' })
  @ApiResponse({
    status: 201,
    description: 'Cadastro realizado com sucesso.',
    schema: {
      example: {
        id: '5219dfad...',
        number: 3,
        email: 'joao@teddy360.com.br',
        password: '$2b$10$pq/WL69cyh6x9P...',
        name: 'João Melo',
        createdAt: '2025-06-05T23:22:32.220Z',
        updatedAt: '2025-06-05T23:22:32.220Z',
        deleted_at: null,
        active: true,
        role: 'ADMIN',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Erro ao criar usuário.' })
  @Post('/signup')
  signUp(@Body() createDto: CreateUserDto) {
    return this.authService.signUp(createDto);
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
  signIn(@Body() signDto: SignInDto) {
    return this.authService.signIn(signDto.email, signDto.password);
  }
}
