import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Request,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dtos/create-url.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtUser } from 'src/auth/interfaces/jwt-payload.interface';
import { Request as ExpressRequest } from 'express';
import { User } from 'src/auth/decorators/user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { getBaseUrl } from 'src/utils/commons';
import { IUrl } from './interfaces/url.interface';

@ApiTags('Urls')
@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createUrlDto: CreateUrlDto,
    @Request() req: ExpressRequest,
    @User() user?: JwtUser,
  ) {
    const baseUrl = getBaseUrl(req);
    return this.urlService.create(createUrlDto, baseUrl, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @User() user: JwtUser,
    @Query('type') type?: 'me' | 'other' | 'both',
    @Query('active') active?: string,
    @Query('deleted') deleted?: string,
  ): Promise<IUrl[]> {
    return this.urlService.findAll(user, type, active, deleted);
  }

  @Get('resolve')
  @HttpCode(HttpStatus.OK)
  findOriginalUrl(@Query('shortenerUrl') shortenerUrl: string, @User() user: JwtUser) {
    return this.urlService.findOriginalUrl(shortenerUrl, user);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createDto: CreateUrlDto,
    @User() user: JwtUser,
  ) {
    return this.urlService.update(id, createDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string, @User() user: JwtUser): Promise<void> {
    return this.urlService.softRemove(id, user);
  }
}
