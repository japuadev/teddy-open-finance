import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';

@Module({
  imports: [PrismaModule],
  controllers: [UrlController],
  providers: [UrlService],
  exports: [UrlService],
})
export class UrlModule {}
