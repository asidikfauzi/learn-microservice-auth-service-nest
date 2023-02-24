import { ValidationPipe } from '@nestjs/common';
import { ConfigService} from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get('RBMQ_URL')],
      queue: configService.get('RBMQ_AUTH_QUEUE'),
      queueOptions: { durable: false },
      prefetchCount: 1,
    },
  });

  await app.startAllMicroservices();
  
  const port = configService.get('PORT')
  await app.listen(port);
  console.log(`Authentication service running on port ${port}`)
}
bootstrap();

