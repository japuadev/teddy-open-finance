import {
  Controller,
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
import { UpdateUserDto } from './dtos/update-user.dto';
import { JWTPayload } from 'src/auth/decorators/jwt-payload.decorator';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { IUser } from './interfaces/user.interface';

@ApiTags('Usuários')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearer')
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
  async findAll(@JWTPayload() payload: JwtPayload): Promise<IUser[]> {
    return await this.userService.findAll(payload.user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Retorna o usuário pelo ID, caso seja o usuário logado ou tenha permissão de ADMIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'Id do usuário cadastrado.',
    required: true,
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
  async findOneById(
    @Param('id', ParseUUIDPipe) id: string,
    @JWTPayload() payload: JwtPayload,
  ): Promise<IUser> {
    return await this.userService.findOneById(id, payload.user);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Atualiza o usuário pelo ID, caso seja o usuário logado ou tenha permissão de ADMIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'Id do usuário cadastrado.',
    required: true,
  })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 200, description: 'Usuário não encontrado.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @JWTPayload() payload: JwtPayload,
    @Body() updateDto: UpdateUserDto,
  ): Promise<IUser> {
    return await this.userService.update(id, payload.user, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary:
      'Desativa cadastro do usuário pelo ID, caso seja o usuário logado ou tenha permissão de ADMIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'Id do usuário cadastrado.',
    required: true,
  })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 200, description: 'Usuário não encontrado.' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @JWTPayload() payload: JwtPayload,
  ): Promise<void> {
    await this.userService.softRemove(id, payload.user);
  }
}
