/* eslint-disable @typescript-eslint/no-unused-vars */
import { InternalServerErrorException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUrlDto } from './dtos/create-url.dto';
import { UpdateUrlDto } from './dtos/update-url.dto';
import { IUrl } from './interfaces/url.interface';
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
  ): Promise<IUrl | string> {
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
        return foundUrl.shortener_url;
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

      return create.shortener_url;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Erro ao criar a URL.');
    }
  }

  findAll() {
    return `This action returns all url`;
  }

  findOne(id: string) {
    return `This action returns a #${id} url`;
  }

  update(id: string, updateUrlDto: UpdateUrlDto) {
    console.log('updateUrlDto', updateUrlDto);
    return `This action updates a #${id} url`;
  }

  remove(id: string) {
    return `This action removes a #${id} url`;
  }
}
