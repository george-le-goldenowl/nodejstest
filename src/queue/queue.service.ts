// src/queue/queue.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { JobOptions, Queue } from 'bull';
import { commonConfig, TCommonConfig } from '../../src/config/common';
import { BirthdayJobData } from '@/type/BirthdayJobData';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);
  private readonly commonConfig: TCommonConfig = commonConfig;
  private options: JobOptions;

  constructor(@InjectQueue('taskQueue') private readonly taskQueue: Queue) {
    this.options = {
      attempts: this.commonConfig.queue.retryCount,
      backoff: {
        type: 'fixed',
        delay: this.commonConfig.queue.delay,
      },
      timeout: this.commonConfig.queue.timeout,
    };
  }

  async addSendBirtdayMessage(data: BirthdayJobData) {
    await this.taskQueue.add('processSendBirtdayMessage', data, this.options);
  }
}
