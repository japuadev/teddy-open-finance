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
import { getBaseUrl } from 'src/utils/commons';
import { IUrl } from './interfaces/url.interface';
import { UrlQueryDto } from '../url/dtos/url-query.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UrlResponseDto } from './dtos/url-response.dto';

@ApiTags('URLs')
@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cria URLs encurtadas para usuários que estão ou não logados no sistema.',
  })
  @ApiResponse({
    status: 201,
    description: 'URL criada com sucesso',
    schema: {
      example: {
        id: 'd9e1bb38...',
        shortener_url: 'http://teddy360.com.br/UYWUV',
        accesses_qty: 0,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Erro ao criar URL.' })
  create(
    @Body() createUrlDto: CreateUrlDto,
    @Request() req: ExpressRequest,
    @User() user?: JwtUser,
  ): Promise<UrlResponseDto> {
    const baseUrl = getBaseUrl(req);
    console.log(createUrlDto, user);
    return this.urlService.create(createUrlDto, baseUrl, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary:
      'Retorna todas as URLs ativas de um usuário logado. Caso tenha permissão de ADMIN, pode retornar URLs desativas ou de outros usuários.',
  })
  @ApiQuery({
    name: 'query',
    type: UrlQueryDto,
    description: 'Filtra URLs por tipo de usuário (USER/ADMIN), deletadas ou atualizadas.',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna todas as URLs ativas criadas pelo usuário.',
    isArray: true,
    schema: {
      example: [
        {
          id: '5094e74a',
          original_url: 'https://teddy360.com.br/fintech/teste/02',
          shortener_url: 'http://teddy360.com.br/kG',
          owner_id: 'e283a46a...',
          accesses_qty: 0,
          createdAt: '2025-06-05T23:31:47.621Z',
          updatedAt: '2025-06-05T23:31:47.621Z',
          deleted_at: null,
          active: true,
          previous_url_id: 'f5a21290...',
        },
        {
          id: 'f5a21290...',
          original_url: 'https://teddy360.com.br/fintech/teste/01',
          shortener_url: 'http://teddy360.com.br/kR2',
          owner_id: 'e283a46a',
          accesses_qty: 0,
          createdAt: '2025-06-03T18:25:31.447Z',
          updatedAt: '2025-06-03T21:01:47.447Z',
          deleted_at: null,
          active: false,
          previous_url_id: null,
        },
      ],
    },
  })
  @ApiResponse({ status: 404, description: 'Nenhuma URL encontrada.' })
  findAll(@User() user: JwtUser, @Query() query: UrlQueryDto): Promise<IUrl[]> {
    const { type, active, deleted } = query;
    return this.urlService.findAll(user, type, active, deleted);
  }

  @Get('resolve')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Retorna a URL original a partir da URL encurtada, por usuário.',
  })
  @ApiQuery({
    name: 'shortenerUrl',
    description: 'Filtrar por URL encurtada.',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'URL de origem retornada.',
    schema: {
      example: {
        id: 'd9e1bb38...',
        original_url: 'https://teddy360.com.br/fintech/teste',
        quantity: 1,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Nenhuma URL encontrada.' })
  findOriginalUrl(
    @Query('shortenerUrl') shortenerUrl: string,
    @User() user: JwtUser,
  ): Promise<UrlResponseDto> {
    return this.urlService.findOriginalUrl(shortenerUrl, user);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary:
      'Cria nova URL a partir da edição da URL original para manter histórico e rastreabilidade das edições.',
  })
  @ApiParam({
    name: 'id',
    description: 'Id da URL cadastrada.',
    required: true,
    type: ParseUUIDPipe,
  })
  @ApiResponse({
    status: 204,
    description:
      'Cria uma nova URL a partir da modificação na URL original. Garantindo a rastreabilidade das atualizações.',
  })
  @ApiResponse({ status: 500, description: 'Erro ao atualizar a URL.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createDto: CreateUrlDto,
    @User() user: JwtUser,
  ): Promise<UrlResponseDto> {
    return this.urlService.update(id, createDto, user);
  }

  @Delete(':id')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Deleta/Desativa uma URL através do ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Id da URL cadastrada.',
    required: true,
    type: ParseUUIDPipe,
  })
  @ApiResponse({
    status: 204,
  })
  @ApiResponse({ status: 500, description: 'Erro ao deletar a URL.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string, @User() user: JwtUser): Promise<void> {
    return this.urlService.softRemove(id, user);
  }
}
