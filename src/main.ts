import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

// import { MicroserviceOptions } from '@nestjs/microservices';
// import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.connectMicroservice<RmqOptions>(rabbitmqServerConfig);

  // app.connectMicroservice<MicroserviceOptions>(rabbitmqServerConfig);
  // await app.startAllMicroservices();
  console.log('RabbitMQ Microservice is running');

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();

  const theme = new SwaggerTheme();
  const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
  };

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, options);

  // app.connectMicroservice<MicroserviceOptions>(rabbitMQConfig());

  // await app.startAllMicroservices();
  // Logger.log('RabbitMQ Microservice is running');

  await app.listen(process.env.PORT ?? 3000);

  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `API documentation is available at: http://localhost:${process.env.PORT ?? 3000}/docs`,
  );
}
bootstrap();
