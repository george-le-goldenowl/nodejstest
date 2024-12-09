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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    ScheduleModule.forRoot(),
    ScheduleModuleJob,
    PipedreamModule,
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
