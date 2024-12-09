import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from '@src/user/user.service';
import { getCurrentTimeByLocation } from '@src/libs/helpers/timezone';
import { PipedreamService } from '@src/pipedream/pipedream.service';
import { Injectable } from '@nestjs/common';
import { ScheduleServiceAbstract } from './schedule.service.interface';
import { Messages } from '@src/libs/enums/messages';
import * as moment from 'moment-timezone';
import { TCommonConfig, commonConfig } from '@src/config/common';

@Injectable()
export class ScheduleService extends ScheduleServiceAbstract {
  private retryCount = 0;
  private maxRetries = 3;
  private readonly config: TCommonConfig;

  constructor(
    private readonly userService: UserService,
    private readonly pipedreamService: PipedreamService,
  ) {
    super();
    this.config = commonConfig;
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
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
    const users = [await this.userService.findOne(1)];

    if (users) {
      users.map((user) => {
        const {
          locations: { city, country },
        } = user;
        const userTimezone = getCurrentTimeByLocation({
          city,
          country,
        });
        const userBirthday = moment.tz(user.birthday, userTimezone);
        const currentUserTime = moment.tz(new Date(), userTimezone);
        const isBirthdayAtNineAM =
          currentUserTime.isSame(userBirthday, 'day') &&
          currentUserTime.hour() === this.config.user.notifyTime &&
          currentUserTime.minute() === 0 &&
          currentUserTime.second() === 0;

        if (isBirthdayAtNineAM) {
          this.pipedreamService.sendMessageToPipedream<{
            message: string;
          }>({
            message: Messages.BIRTHDAY.replace(
              '{full_name}',
              user.firstname + ' ' + user.lastname,
            ),
          });
        } else {
          console.log(`Not a birthday: ${currentUserTime}, ${userBirthday}`);
        }
      });
    }

    console.log('Job processed successfully at:', new Date());
  }
}
