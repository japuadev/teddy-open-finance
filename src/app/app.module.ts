/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UrlModule } from 'src/url/url.module';

@Module({
  imports: [
    UrlModule,
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useFactory: (ref) => new JwtAuthGuard(ref),
      inject: [Reflector],
    },
    PrismaService,
  ],
  exports: [PrismaService],
})
export class AppModule {}
