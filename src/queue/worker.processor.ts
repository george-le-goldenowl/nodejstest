import { IBirthdayJobHandler } from '@/task/contract/sendBirtdayMessage.contract';
import { getCurrentTimeByLocation } from '../../src/libs/helpers/timezone';
import { BirthdayJobData } from '@/type/BirthdayJobData';
import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import moment from 'moment-timezone';

@Processor('taskQueue')
export class WorkerProcessor {
  private readonly logger = new Logger(WorkerProcessor.name);

  constructor(
    @Inject('IBirthdayJobHandler')
    private readonly birthdayJobHandler: IBirthdayJobHandler,
  ) {}

  @Process({
    name: 'processSendBirtdayMessage',
    concurrency: 3,
  })
  async processSendBirtdayMessage(job: Job<BirthdayJobData>) {
    const { users } = job.data;

    try {
      for (const user of users) {
        const {
          locations: { city, country },
        } = user;
        const userTimezone = getCurrentTimeByLocation({ city, country });
        const userBirthday = moment.tz(user.birthday, userTimezone);
        const currentUserTime = moment.tz(new Date(), userTimezone);
        await this.birthdayJobHandler.handle({
          user,
          userTimezone,
          userBirthday,
          currentUserTime,
        });
      }
      console.log('Job processed successfully');
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
