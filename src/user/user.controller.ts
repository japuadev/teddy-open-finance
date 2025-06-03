import { Controller, Post, Body, Get, Request, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './interfaces/dto/create.user.dto';
// import { UpdateUserDto } from './interfaces/dto/update.user.dto';'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }

  // @Get('/:id')
  // async getUser(@Param('id') id: string, @Request() req: any) {
  //   const userPayload = req.user;
  //   return this.userService.getUserById(id, userPayload);
  // }

  // @Get('/all')
  // async getAllUsers(@Request() req: any) {
  //   const userPayload = req.user;
  //   return this.userService.getUserById(userPayload);
  // }

  // @Put('/:id')
  // async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto, @Request() req: any) {
  //   const userPayload = req.user;
  //   return this.userService.updateUser(id, body, userPayload);
  // }

  // @Delete(':id')
  // async softDelete(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return await this.userService.softDeleteUserById(id);
  // }
}
