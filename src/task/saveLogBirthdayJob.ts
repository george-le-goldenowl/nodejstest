import { Injectable, Logger } from '@nestjs/common';
import {
  IBirthdayJobHandler,
  TSendBirtdayMessage,
} from './contract/sendBirtdayMessage.contract';
import { WorkerProcessor } from '../../src/queue/worker.processor';

@Injectable()
export class SaveLogBirthdayJob implements IBirthdayJobHandler {
  private readonly logger = new Logger(WorkerProcessor.name);

  async handle(data: TSendBirtdayMessage): Promise<void> {
    const { user, userTimezone, userBirthday, currentUserTime } = data;
    this.logger.log(
      `Birthday message sent to: ${user.firstname} ${user.lastname}, ${currentUserTime}, ${userBirthday}, ${userTimezone}`,
    );
  }
}
