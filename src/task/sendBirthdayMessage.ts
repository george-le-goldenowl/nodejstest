import { Injectable } from '@nestjs/common';
import {
  IBirthdayJobHandler,
  TSendBirtdayMessage,
} from './contract/sendBirtdayMessage.contract';
import { Messages } from '../../src/libs/enums/messages';
import { PipedreamService } from '../../src/pipedream/pipedream.service';

@Injectable()
export class SendBirtdayMessageTask implements IBirthdayJobHandler {
  constructor(private readonly pipedreamService: PipedreamService) {}

  async handle(data: TSendBirtdayMessage): Promise<void> {
    try {
      const { user, userBirthday, currentUserTime } = data;
      const isBirthdayAtNineAM =
        currentUserTime.isSame(userBirthday, 'day') &&
        currentUserTime.hour() === 9 &&
        currentUserTime.minute() === 0 &&
        currentUserTime.second() === 0;

      if (isBirthdayAtNineAM) {
        await this.pipedreamService.sendMessageToPipedream<{
          message: string;
        }>({
          message: Messages.BIRTHDAY.replace(
            '{full_name}',
            user.firstname + ' ' + user.lastname,
          ),
        });
        console.log(
          `Birthday message sent to: ${user.firstname} ${user.lastname}`,
        );
      } else {
        console.log(`Not a birthday: ${currentUserTime}, ${userBirthday}`);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
