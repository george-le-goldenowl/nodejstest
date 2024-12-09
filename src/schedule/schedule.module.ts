import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { UserModule } from '@src/user/user.module';
import { PipedreamModule } from '@src/pipedream/pipedream.module';

@Module({
  imports: [UserModule, PipedreamModule],
  providers: [ScheduleService],
})
export class ScheduleModuleJob {}
