import * as dotenv from 'dotenv';
import { User } from './src/user/entities/user.entity';
dotenv.config();

export default {
  type: 'postgres' as const,
  url: 'postgresql://postgres:123456789@localhost:5432/birthday_message2',
  entities: [User],
  synchronize: true,
  logging: false,
  seeds: ['src/db/seeding/seeds/**/*{.ts,.js}'],
  factories: ['src/db/seeding/factories/**/*{.ts,.js}'],
};
