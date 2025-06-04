import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { config } from 'dotenv';
// import { AuthGuard } from './auth/auth.guard';
// import { JwtService } from '@nestjs/jwt';
// import { Reflector } from '@nestjs/core';

async function bootstrap(): Promise<void> {
  config();
  const app = await NestFactory.create(AppModule);

  const docsConfig = new DocumentBuilder()
    .setTitle('Teddy Open Finance - URL SHORTENER API')
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
  app.useGlobalPipes();

  // const jwtService = new JwtService();
  // const reflector = new Reflector();

  // app.useGlobalGuards(new AuthGuard(jwtService, reflector));

  await app.listen(process.env.PORT ?? 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
