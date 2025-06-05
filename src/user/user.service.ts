import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './interfaces/dto/create.user.dto';
import { IUser } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './interfaces/dto/update.user.dto';
import { DeletedResponse } from 'src/utils/response';
import { constants } from 'src/utils/constants';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createDto: CreateUserDto): Promise<IUser> {
    try {
      const existingUser = await this.prisma.users.findUnique({
        where: { email: createDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('E-mail já cadastrado');
      }

      const salt = await bcrypt.genSalt(10);
      createDto.password = await bcrypt.hash(createDto.password, salt);

      return await this.prisma.users.create({
        data: {
          email: createDto.email,
          password: createDto.password,
          name: createDto.name,
          role: createDto.role ?? 'USER',
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const errorMessage = typeof error === 'string' ? error : 'Erro Interno do Servidor';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(email: string): Promise<IUser | undefined> {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    return user ?? undefined;
  }

  async getUserById(id: string, userPayload: { id: string; role: string }): Promise<IUser> {
    try {
      if (userPayload.id !== id && userPayload.role !== 'ADMIN') {
        throw new ForbiddenException('Você não tem permissão para visualizar este usuário');
      }

      const existingUser = await this.prisma.users.findFirst({
        where: {
          id,
          deleted_at: null,
          active: true,
        },
      });

      if (!existingUser) {
        throw new BadRequestException('Usuário não encontrado');
      }

      return existingUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const errorMessage = typeof error === 'string' ? error : 'Erro Interno do Servidor';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllUsers(userPayload: { id: string; role: string }): Promise<IUser[]> {
    try {
      if (userPayload.role !== 'ADMIN') {
        throw new ForbiddenException('Você não tem permissão para visualizar todos os usuários');
      }

      const users = await this.prisma.users.findMany({
        where: {
          deleted_at: null,
          active: true,
        },
      });

      if (!users || users.length === 0) {
        throw new BadRequestException('Nenhum usuário encontrado');
      }

      return users;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const errorMessage = typeof error === 'string' ? error : 'Erro Interno do Servidor';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateById(
    id: string,
    userPayload: { id: string; role: string },
    updateDto: UpdateUserDto,
  ): Promise<IUser> {
    try {
      if (userPayload.role !== 'ADMIN' && userPayload.id !== id) {
        throw new ForbiddenException('Você não tem permissão para atualizar este usuário');
      }

      const existingUser = await this.prisma.users.findFirst({
        where: { id: id, deleted_at: null, active: true },
      });

      if (!existingUser) {
        throw new BadRequestException('Usuário não encontrado');
      }

      if (updateDto?.password) {
        const salt = await bcrypt.genSalt(10);
        updateDto.password = await bcrypt.hash(updateDto.password, salt);
      }

      return await this.prisma.users.update({
        where: { id: id },
        data: {
          ...updateDto,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const errorMessage = typeof error === 'string' ? error : 'Erro Interno do Servidor';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async softDeleteUserById(
    id: string,
    userPayload: { id: string; role: string },
  ): Promise<DeletedResponse> {
    try {
      if (userPayload.role !== 'ADMIN' && userPayload.id !== id) {
        throw new ForbiddenException('Você não tem permissão para atualizar este usuário');
      }

      const existingUser = await this.prisma.users.findFirst({
        where: { id: id, deleted_at: null, active: true },
      });

      if (!existingUser) {
        throw new BadRequestException('Usuário não encontrado ou já excluído');
      }

      await this.prisma.users.update({
        where: { id: id },
        data: {
          deleted_at: new Date(),
          active: false,
        },
      });

      return new DeletedResponse(constants.DELETE);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const errorMessage = typeof error === 'string' ? error : 'Erro Interno do Servidor';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
