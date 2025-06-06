/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  InternalServerErrorException,
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUrlDto } from './dtos/create-url.dto';
import { IUrl } from './interfaces/url.interface';
import { findActiveUrl, generateShortCode } from 'src/utils/commons';
import { UrlResponseDto } from './dtos/url-response.dto';
const MAX_ATTEMPTS = 10;

@Injectable()
export class UrlService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createDto: CreateUrlDto,
    baseUrl: string,
    userPayload?: { id: string; role: string },
    previousUrlId?: string,
  ): Promise<UrlResponseDto> {
    try {
      const foundByOriginal = await findActiveUrl(this.prisma, {
        original_url: createDto.original_url,
        owner_id: userPayload?.id ?? null,
      });

      if (foundByOriginal) {
        await this.prisma.urls.update({
          where: { id: foundByOriginal.id },
          data: { accesses_qty: { increment: 1 } },
        });

        return {
          id: foundByOriginal.id,
          shortener_url: foundByOriginal.shortener_url,
          accesses_qty: foundByOriginal.accesses_qty,
        };
      }

      let shortCode: string = '';
      let foundShortener: IUrl | null = null;

      baseUrl = baseUrl || process.env.BASE_URL!;

      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        shortCode = generateShortCode();
        foundShortener = await this.prisma.urls.findFirst({
          where: {
            shortener_url: {
              endsWith: shortCode,
            },
            deleted_at: null,
            active: true,
          },
        });

        if (!foundShortener) break;
      }

      if (foundShortener || !shortCode) {
        throw new InternalServerErrorException('Não foi possível gerar a URL. Tente novamente.');
      }

      const create = await this.prisma.urls.create({
        data: {
          original_url: createDto.original_url,
          shortener_url: `${baseUrl}/${shortCode}`,
          owner_id: userPayload?.id ?? null,
          previous_url_id: previousUrlId ?? null,
        },
      });

      return {
        id: create.id,
        shortener_url: create.shortener_url,
        accesses_qty: create.accesses_qty,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Erro ao criar a URL.');
    }
  }

  async findAll(
    userPayload: { id: string; role: string },
    type: 'me' | 'other' | 'both' = 'me',
    active?: string,
    deleted?: string,
  ): Promise<IUrl[]> {
    try {
      const isAdmin = userPayload.role === 'ADMIN';
      const safeType = isAdmin ? type : 'me';

      if (userPayload.role !== 'ADMIN' && type !== 'me') {
        throw new ForbiddenException(
          'Usuários sem perfil ADMIN só podem acessar suas próprias URLs',
        );
      }

      const where: any = {};

      switch (safeType) {
        case 'me':
          where.owner_id = userPayload.id;
          break;
        case 'other':
          where.OR = [{ owner_id: null }, { owner_id: { not: userPayload.id } }];
          break;
        case 'both':
          break;
      }

      const activeBool = active === 'false' ? false : true;
      const deletedBool = deleted === 'true' ? true : false;

      if (isAdmin && active) {
        where.active = activeBool;
      } else if (!isAdmin) {
        where.active = true;
      }

      if (isAdmin && deletedBool === true) {
        where.deleted_at = { not: null };
      } else if (!isAdmin || deletedBool === false) {
        where.deleted_at = null;
      }

      const urls = await this.prisma.urls.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      if (!urls.length) {
        throw new NotFoundException('Nenhuma URL encontrada.');
      }

      return urls;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new HttpException('Erro ao buscar URLs.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOriginalUrl(
    shortener_url: string,
    userPayload: { id: string; role: string },
  ): Promise<{ id: string; original_url: string; accesses_qty: number }> {
    try {
      const byShortener = await findActiveUrl(this.prisma, {
        shortener_url,
        owner_id: userPayload.id,
      });

      if (!byShortener) {
        throw new NotFoundException('URL não encontrada.');
      }

      const updatedUrl = await this.prisma.urls.update({
        where: { id: byShortener.id },
        data: { accesses_qty: { increment: 1 } },
      });

      return {
        id: updatedUrl.id,
        original_url: updatedUrl.original_url,
        accesses_qty: updatedUrl.accesses_qty,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const errorMessage = typeof error === 'string' ? error : 'Erro Interno do Servidor';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(
    id: string,
    updateDto: CreateUrlDto,
    userPayload: { id: string; role: string },
  ): Promise<UrlResponseDto> {
    try {
      const existingUrl = await findActiveUrl(this.prisma, {
        id,
        owner_id: userPayload.id,
      });

      if (!existingUrl) {
        throw new BadRequestException('URL não encontrada ou inativa.');
      }

      if (existingUrl.original_url === updateDto.original_url) {
        return {
          id: existingUrl.id,
          shortener_url: existingUrl.shortener_url,
          accesses_qty: existingUrl.accesses_qty,
        };
      }

      await this.prisma.urls.update({
        where: { id },
        data: {
          active: false,
          updatedAt: new Date(),
        },
      });

      const created = await this.create(
        updateDto,
        process.env.BASE_URL!,
        userPayload,
        existingUrl.id,
      );

      if (!created) {
        throw new HttpException('Erro ao atualizar a URL.', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return {
        id: created.id,
        shortener_url: created.shortener_url,
        accesses_qty: created.accesses_qty,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      console.error(error);
      throw new HttpException('Erro ao atualizar a URL.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async softRemove(id: string, userPayload: { id: string; role: string }): Promise<void> {
    try {
      const existingUrl = await findActiveUrl(this.prisma, {
        id,
        owner_id: userPayload.id,
      });

      if (!existingUrl) {
        throw new BadRequestException('URL não encontrada ou já removida.');
      }

      await this.prisma.urls.update({
        where: { id },
        data: { deleted_at: new Date(), active: false },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const errorMessage = typeof error === 'string' ? error : 'Erro Interno do Servidor';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
