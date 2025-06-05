import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  Param,
  Patch,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { JwtUser } from '../auth/interfaces/jwt-payload.interface';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Public } from 'src/auth/decorators/public.decorator';

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
  async findAll(@Request() req: { user: JwtUser }) {
    return this.userService.findAll(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async findOneById(@Param('id') id: string, @Request() req: { user: JwtUser }) {
    return this.userService.findOneById(id, req.user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Request() req: { user: JwtUser },
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.update(id, req.user, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: { user: JwtUser }) {
    return await this.userService.softRemove(id, req.user);
  }
}
