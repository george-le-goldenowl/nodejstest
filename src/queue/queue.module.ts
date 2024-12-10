import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WorkerProcessor } from './worker.processor';
import { QueueService } from './queue.service';
import { SaveLogBirthdayJob } from '../../src/task/SaveLogBirthdayJob';
// import { SendBirtdayMessageTask } from '../../src/task/sendBirthdayMessage';
import { PipedreamModule } from '../../src/pipedream/pipedream.module';

@Module({
  imports: [
    ConfigModule,
    PipedreamModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'taskQueue',
    }),
  ],
  providers: [
    QueueService,
    WorkerProcessor,
    {
      provide: 'IBirthdayJobHandler',
      useClass: SaveLogBirthdayJob,
    },
  ],
  exports: [QueueService],
})
export class QueueModule {}
