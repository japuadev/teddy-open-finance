import { Controller, Post, Body, Get, Request, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './interfaces/dto/create.user.dto';
import { JwtUser } from '../auth/interfaces/jwt-payload.interface';
import { UpdateUserDto } from './interfaces/dto/update.user.dto';
import { Public } from 'src/auth/public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async create(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }
  @Get('/:id')
  async getUser(@Param('id') id: string, @Request() req: { user: JwtUser }) {
    return this.userService.getUserById(id, req.user);
  }

  @Public()
  @Get('/show-all')
  async getAllUsers(@Request() req: JwtUser) {
    return this.userService.getAllUsers(req);
  }
  @Put('/:id')
  async update(@Param('id') id: string, @Request() req: JwtUser, @Body() body: UpdateUserDto) {
    return this.userService.updateById(id, req, body);
  }
  @Delete(':id')
  async softDelete(@Param('id') id: string, @Request() req: JwtUser) {
    return await this.userService.softDeleteUserById(id, req);
  }
}
