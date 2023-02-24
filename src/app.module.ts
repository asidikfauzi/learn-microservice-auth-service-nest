import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService, TokenService } from './services';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.registerAsync([
      {
        name: 'LOG_SERVICE',
        imports: [ConfigModule],
        useFactory: async(configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${configService.get('RBMQ_URL')}`],
            queue: `${configService.get('RBMQ_LOG_QUEUE')}`,
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      }
    ])
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, TokenService],
})
export class AppModule {}
