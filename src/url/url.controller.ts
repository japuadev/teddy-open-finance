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
import { UpdateUrlDto } from './dtos/update-url.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtUser } from 'src/auth/interfaces/jwt-payload.interface';
import { Request as ExpressRequest } from 'express';

@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUrlDto: CreateUrlDto, @Request() req: ExpressRequest & { user?: JwtUser }) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const user = req.user ?? undefined;
    return this.urlService.create(createUrlDto, baseUrl, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Request() req: { user: JwtUser }) {
    return this.urlService.findAll(req.user);
  }

  @Get('shortenes')
  @HttpCode(HttpStatus.OK)
  findOriginalUrl(@Query('shortenerUrl') shortenerUrl: string, @Request() req: { user: JwtUser }) {
    return this.urlService.findOriginalUrl(shortenerUrl, req.user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.urlService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateUrlDto: UpdateUrlDto) {
    return this.urlService.update(id, updateUrlDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string, @Request() req: { user: JwtUser }) {
    return this.urlService.softRemove(id, req.user);
  }
}
