import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { UserModule } from '@/user/user.module';
import { PipedreamModule } from '@/pipedream/pipedream.module';
import { QueueModule } from '@/queue/queue.module';

@Module({
  imports: [UserModule, PipedreamModule, QueueModule],
  providers: [ScheduleService],
})
export class ScheduleModuleJob {}
