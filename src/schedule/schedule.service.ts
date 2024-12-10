import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from '../../src/user/user.service';
import { Injectable } from '@nestjs/common';
import { ScheduleServiceAbstract } from './schedule.service.interface';
import { TCommonConfig, commonConfig } from '../../src/config/common';
import { QueueService } from '../../src/queue/queue.service';
import _ from 'lodash';

@Injectable()
export class ScheduleService extends ScheduleServiceAbstract {
  private retryCount = 0;
  private maxRetries = 3;
  private readonly config: TCommonConfig = commonConfig;

  constructor(
    private readonly userService: UserService,
    private readonly queueService: QueueService,
  ) {
    super();
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron(): Promise<void> {
    try {
      console.log('Cron job started at:', new Date());
      await this.processJob();
      console.log('Cron job completed successfully');
      this.retryCount = 0;
    } catch (error) {
      console.error('Error encountered in cron job:', error);

      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`Retry attempt ${this.retryCount} of ${this.maxRetries}`);

        await new Promise((resolve) => setTimeout(resolve, 5000));
        await this.handleCron(); // Retry the job
      } else {
        console.error('Max retry attempts reached. Job failed.');
        this.retryCount = 0;
      }
    }
  }

  async processJob() {
    const users = await this.userService.findAll();

    if (users && users.length > 0) {
      const chunks = _.chunk(users, this.config.chunk);
      const processedChunks = new Set();

      for (const [index, chunk] of chunks.entries()) {
        const chunkKey = JSON.stringify(chunk); // This may not be efficient for large chunks; consider other approaches.
        if (!processedChunks.has(chunkKey)) {
          console.log(
            `Adding chunk ${index + 1} to the queue with ${chunk.length} users.`,
          );
          await this.queueService.addSendBirtdayMessage({
            users: chunk,
          });
          processedChunks.add(chunkKey);
        } else {
          console.log(`Chunk ${index + 1} already processed.`);
        }
      }

      console.log('All chunks added to the queue.');
    } else {
      console.log('No users found for processing.');
    }

    console.log('Job processed successfully at:', new Date());
  }
}
