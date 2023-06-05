import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { JwtGuard, RolesGuard, SubscriptionGuard, UserStatusGuard } from './auth/guards';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { UserService } from './user/services/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const reflector = app.get(Reflector);
  // const userService = app.get(UserService);
  // app.useGlobalGuards(new JwtGuard(), new RolesGuard(reflector), new UserStatusGuard(userService), new SubscriptionGuard(userService) );
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))

  const options = new DocumentBuilder()
    .setTitle('BlogApp')
    .setDescription('Blog NestApp Rest Api Docs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT Token',
        in: 'header',
      },
      'JWT-Auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
