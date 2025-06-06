import { Urls, Users } from '@prisma/client';

export interface IUrl extends Urls {
  owner?: Users | null;
  shortener_url: string;
  previous_url?: Urls | null;
  next_versions?: Urls[];
}
