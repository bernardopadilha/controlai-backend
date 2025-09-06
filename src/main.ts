import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

import { apiReference } from '@scalar/nestjs-api-reference';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

const PORT = Number(process.env.PORT || 3333);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'development'
        ? ['http://localhost:5173', 'http://127.0.0.1:5173']
        : [/\.bernardopadilha\.com\.br$/],
    credentials: true,
  });

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //   }),
  // );

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  const config = new DocumentBuilder()
    .setTitle('ControlAI Docs')
    .setDescription('Desafio para vaga front-end')
    .setVersion('1.0.0')
    .setContact(
      'Bernardo Padilha',
      'https://www.bernardopadilha.com.br/',
      'bernardoa.padilha@gmailcom',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Insira o token JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  app.use(
    '/docs',

    apiReference({
      content: document,
    }),
  );

  await app.listen(PORT, () => {
    console.log(`🦁 NestJS listening at http://localhost:${PORT}/`);
    console.log(`📚 Scalar docs at http://localhost:${PORT}/docs`);
  });
}
bootstrap();
