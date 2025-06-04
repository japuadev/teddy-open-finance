import { Controller, Post, Body, Get, Request, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './interfaces/dto/create.user.dto';
import { JwtPayload } from '../auth/interfaces/jwt.interface';
import { UpdateUserDto } from './interfaces/dto/update.user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }

  @Get('/:id')
  async getUser(@Param('id') id: string, @Request() req: { user: JwtPayload }) {
    return this.userService.getUserById(id, req.user);
  }

  @Get('/all')
  async getAllUsers(@Request() req: JwtPayload) {
    return this.userService.getAllUsers(req);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Request() req: JwtPayload, @Body() body: UpdateUserDto) {
    return this.userService.updateById(id, req, body);
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string, @Request() req: JwtPayload) {
    return await this.userService.softDeleteUserById(id, req);
  }
}
