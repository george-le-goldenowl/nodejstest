import { User } from '@/user/entities/user.entity';
import { Moment } from 'moment-timezone';

export type TSendBirtdayMessage = {
  user: User;
  userTimezone: string;
  userBirthday: Moment;
  currentUserTime: Moment;
};

export interface IBirthdayJobHandler {
  handle(data: TSendBirtdayMessage): Promise<void>;
}
