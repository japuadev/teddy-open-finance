// urls.service.ts
import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 6);

@Injectable()
export class UrlService {
  constructor(private prisma: PrismaService) {}

  async create(originalUrl: string, ownerId?: string, baseUrl?: string) {
    try {
      const maxAttempts = 5;

      if (!baseUrl) {
        baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      }

      for (let i = 0; i < maxAttempts; i++) {
        const shortCode = nanoid();
        const exists = await this.prisma.urls.findFirst({
          where: {
            shortener_url: shortCode,
            owner_id: ownerId ?? null,
          },
        });

        if (!exists) {
          await this.prisma.urls.create({
            data: {
              original_url: originalUrl,
              shortener_url: shortCode,
              owner_id: ownerId ?? null,
            },
          });
          i = maxAttempts;
          return `${baseUrl}/${shortCode}`;
        }
      }
    } catch (error: any) {
      const errorMessage = typeof error === 'string' ? error : 'Erro Interno do Servidor';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOriginalUrl(shortCode: string, ownerId?: string): Promise<string> {
    const url = await this.prisma.urls.findFirst({
      where: {
        shortener_url: shortCode,
        owner_id: ownerId ?? null,
        deleted_at: null,
        active: true,
      },
    });

    if (!url) throw new NotFoundException('URL não encontrada');

    await this.prisma.urls.update({
      where: { id: url.id },
      data: {
        accesses_qty: { increment: 1 },
      },
    });

    return url.original_url;
  }
}
