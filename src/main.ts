import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { config } from 'dotenv';

async function bootstrap(): Promise<void> {
  config();
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  const docsConfig = new DocumentBuilder()
    .setTitle('Teddy Open Shortener Url')
    .setDescription('API built to be URL shorteners for authenticated and unauthenticated users.')
    .setVersion('0.1.0')
    .addTag('documentation')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, docsConfig);
  SwaggerModule.setup('api/docs', app, documentFactory);

  app.enableCors({
    origin: true,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
