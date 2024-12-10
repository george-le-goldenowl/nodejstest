import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './config/typeorm';
import { ScheduleService } from './schedule/schedule.service';
import { ScheduleServiceAbstract } from './schedule/schedule.service.interface';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleModuleJob } from './schedule/schedule.module';
import { PipedreamModule } from './pipedream/pipedream.module';
import { QueueModule } from './queue/queue.module';
import Joi from 'joi';

const EnvSchema = {
  PORT: Joi.number(),
  NODE_ENV: Joi.string(),
  DB_TYPE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_NAME: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
};

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [typeorm],
      isGlobal: true,
      validationSchema: Joi.object(EnvSchema),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    // ScheduleModule.forRoot(),
    ScheduleModuleJob,
    PipedreamModule,
    QueueModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: ScheduleServiceAbstract,
      useClass: ScheduleService,
    },
  ],
})
export class AppModule {}
