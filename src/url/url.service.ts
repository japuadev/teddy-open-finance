/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  InternalServerErrorException,
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUrlDto } from './dtos/create-url.dto';
import { UpdateUrlDto } from './dtos/update-url.dto';
import { IUrl } from './interfaces/url.interface';
import { DeletedResponse } from 'src/utils/response';
import { constants } from 'src/utils/constants';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 6);
const MAX_ATTEMPTS = 10;

@Injectable()
export class UrlService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createDto: CreateUrlDto,
    baseUrl: string,
    userPayload?: { id: string; role: string },
  ): Promise<{ shortener_url: string }> {
    try {
      const { original_url, previous_url_id } = createDto;

      const foundUrl = await this.prisma.urls.findFirst({
        where: {
          original_url,
          owner_id: userPayload?.id ?? null,
          deleted_at: null,
          active: true,
        },
      });

      if (foundUrl) {
        await this.prisma.urls.update({
          where: { id: foundUrl.id },
          data: { accesses_qty: { increment: 1 } },
        });
        return { shortener_url: foundUrl.shortener_url };
      }

      let shortCode: string = '';
      let foundShortener: IUrl | null = null;

      baseUrl = baseUrl || process.env.BASE_URL!;

      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        shortCode = nanoid();
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
          original_url,
          shortener_url: `${baseUrl}/${shortCode}`,
          owner_id: userPayload?.id ?? null,
        },
      });

      return { shortener_url: create.shortener_url };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Erro ao criar a URL.');
    }
  }

  async findAll(userPayload: { id: string; role: string }): Promise<IUrl[]> {
    try {
      const urls = await this.prisma.urls.findMany({
        where: {
          owner_id: userPayload?.id,
          deleted_at: null,
          active: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!urls || urls.length === 0) {
        throw new NotFoundException('Nenhuma URL encontrada.');
      }

      return urls;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const errorMessage = typeof error === 'string' ? error : 'Erro Interno do Servidor';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findOne(id: string) {
    return `This action returns a #${id} url`;
  }

  update(id: string, updateUrlDto: UpdateUrlDto) {
    console.log('updateUrlDto', updateUrlDto);
    return `This action updates a #${id} url`;
  }

  async findOriginalUrl(
    shortener_url: string,
    userPayload: { id: string; role: string },
  ): Promise<{ original_url: string; quantity: number }> {
    try {
      const url = await this.prisma.urls.findFirst({
        where: {
          shortener_url,
          deleted_at: null,
          active: true,
          OR: [{ owner_id: userPayload?.id }, { owner_id: null }],
        },
      });

      if (!url) {
        throw new NotFoundException('URL não encontrada.');
      }

      const updatedUrl = await this.prisma.urls.update({
        where: { id: url.id },
        data: { accesses_qty: { increment: 1 } },
      });

      return { original_url: updatedUrl.original_url, quantity: updatedUrl.accesses_qty };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const errorMessage = typeof error === 'string' ? error : 'Erro Interno do Servidor';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async softRemove(
    id: string,
    userPayload: { id: string; role: string },
  ): Promise<DeletedResponse> {
    try {
      const existingUrl = await this.prisma.urls.findFirst({
        where: { id, owner_id: userPayload.id, deleted_at: null, active: true },
      });

      if (!existingUrl) {
        throw new BadRequestException('URL não encontrada ou já removida.');
      }

      await this.prisma.urls.update({
        where: { id },
        data: { deleted_at: new Date(), active: false },
      });

      return new DeletedResponse(constants.DELETE);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const errorMessage = typeof error === 'string' ? error : 'Erro Interno do Servidor';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
