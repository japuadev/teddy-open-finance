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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@User() user: JwtUser) {
    return this.userService.findAll(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOneById(@Param('id', ParseUUIDPipe) id: string, @User() user: JwtUser) {
    return this.userService.findOneById(id, user);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: JwtUser,
    @Body() body: UpdateUserDto,
  ): Promise<void> {
    await this.userService.update(id, user, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string, @User() user: JwtUser): Promise<void> {
    await this.userService.softRemove(id, user);
  }
}
