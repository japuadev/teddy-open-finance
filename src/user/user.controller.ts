import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  Param,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './interfaces/dto/create.user.dto';
import { JwtUser } from '../auth/interfaces/jwt-payload.interface';
import { UpdateUserDto } from './interfaces/dto/update.user.dto';
import { Public } from 'src/auth/public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/show-all')
  async getAllUsers(@Request() req: { user: JwtUser }) {
    return this.userService.getAllUsers(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getUser(@Param('id') id: string, @Request() req: { user: JwtUser }) {
    return this.userService.getUserById(id, req.user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Request() req: { user: JwtUser },
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.updateById(id, req.user, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async softDelete(@Param('id') id: string, @Request() req: { user: JwtUser }) {
    return await this.userService.softDeleteUserById(id, req.user);
  }
}
