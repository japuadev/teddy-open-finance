import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { setupSwagger } from './swagger/swagger.config';
import { config } from 'dotenv';

async function bootstrap(): Promise<void> {
  config();
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

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
