import { PrismaService } from 'prisma/prisma.service';
import { IUrl } from 'src/url/interfaces/url.interface';
import { customAlphabet } from 'nanoid';
import { Request } from 'express';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const nanoid = customAlphabet(alphabet, 6);

type UrlWhereInput = {
  id?: string;
  original_url?: string;
  shortener_url?: string;
  owner_id: string | null;
};

export async function findActiveUrl(
  prisma: PrismaService,
  filters: UrlWhereInput,
): Promise<IUrl | null> {
  return prisma.urls.findFirst({
    where: {
      ...filters,
      deleted_at: null,
      active: true,
    },
  });
}

export function generateShortCode(): string {
  const length = Math.floor(Math.random() * 6) + 1;
  return nanoid(length);
}

export function getBaseUrl(req: Request): string {
  return `${req.protocol}://${req.get('host')}`;
}
