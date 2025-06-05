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
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createUrlDto: CreateUrlDto, @Request() req: ExpressRequest & { user?: JwtUser }) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const user = req.user ?? undefined;
    return this.urlService.create(createUrlDto, baseUrl, user);
  }

  @Get()
  findAll() {
    return this.urlService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.urlService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUrlDto: UpdateUrlDto) {
    return this.urlService.update(id, updateUrlDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.urlService.remove(id);
  }
}
