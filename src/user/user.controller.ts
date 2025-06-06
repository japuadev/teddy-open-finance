import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtUser } from 'src/auth/interfaces/jwt-payload.interface';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { IUser } from './interfaces/user.interface';

@ApiTags('Usuários')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastra usuário e retorna os dados desse usuário.' })
  @ApiResponse({
    status: 201,
    description: 'Cadastro realizado com sucesso.',
    schema: {
      example: {
        id: '5219dfad-d917...',
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
  async create(@Body() createDto: CreateUserDto): Promise<IUser> {
    return await this.userService.create(createDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Retorna todos os usuários cadastrados, se tiver permissão de ADMIN.' })
  @ApiResponse({
    status: 200,
    isArray: true,
    description: 'Usuário encontrado.',
    schema: {
      example: [
        {
          id: 'e283a46a...',
          number: 2,
          email: 'investimento_ia@teddy360.com',
          password: '$2b$10$LlLSZ...',
          name: 'Investidores em IA',
          createdAt: '2025-06-05T23:21:43.050Z',
          updatedAt: '2025-06-05T23:21:43.050Z',
          deleted_at: null,
          active: true,
          role: 'ADMIN',
        },
        {
          id: '5219dfad...',
          number: 3,
          email: 'financeiro@teddy360.com',
          password: '$2b$10$pq...',
          name: 'Setor Financeiro',
          createdAt: '2025-06-05T23:22:32.220Z',
          updatedAt: '2025-06-05T23:22:32.220Z',
          deleted_at: null,
          active: true,
          role: 'USER',
        },
      ],
    },
  })
  @ApiResponse({ status: 200, description: 'Nenhum usuário não encontrado.' })
  async findAll(@User() user: JwtUser): Promise<IUser[]> {
    return await this.userService.findAll(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Retorna o usuário pelo ID, caso seja o usuário logado ou tenha permissão de ADMIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'Id do usuário cadastrado.',
    required: true,
    type: ParseUUIDPipe,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado.',
    schema: {
      example: {
        id: '41173d78-4fb5-4f95-9ec3-6e6d5a16d619',
        number: 1,
        email: 'joao@teddy360.com.br',
        password: '$2b$10$lBwe...',
        name: 'João Melo',
        createdAt: '2025-06-06T18:30:57.425Z',
        updatedAt: '2025-06-06T18:30:57.425Z',
        deleted_at: null,
        active: true,
        role: 'USER',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Usuário não encontrado.' })
  async findOneById(@Param('id', ParseUUIDPipe) id: string, @User() user: JwtUser): Promise<IUser> {
    return await this.userService.findOneById(id, user);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Atualiza o usuário pelo ID, caso seja o usuário logado ou tenha permissão de ADMIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'Id do usuário cadastrado.',
    required: true,
    type: ParseUUIDPipe,
  })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 200, description: 'Usuário não encontrado.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: JwtUser,
    @Body() body: UpdateUserDto,
  ): Promise<IUser> {
    return await this.userService.update(id, user, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary:
      'Desativa cadastro do usuário pelo ID, caso seja o usuário logado ou tenha permissão de ADMIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'Id do usuário cadastrado.',
    required: true,
    type: ParseUUIDPipe,
  })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 200, description: 'Usuário não encontrado.' })
  async remove(@Param('id', ParseUUIDPipe) id: string, @User() user: JwtUser): Promise<void> {
    await this.userService.softRemove(id, user);
  }
}
