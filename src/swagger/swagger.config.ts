import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Teddy360 URL')
    .setDescription('Documentação da API para encurtar URLs. Para usuários autenticados ou não.')
    .setVersion('0.1.0')
    .addServer(process.env.BASE_URL!)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'token',
        description: 'Cole o token JWT retornado no campo `token`, sem o prefixo Bearer.',
      },
      'token',
    )
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      tagsSorter: (a: string, b: string) => {
        const order = ['Autenticação', 'URLs', 'Usuários'];
        return order.indexOf(a) - order.indexOf(b);
      },
    },
  });
}
