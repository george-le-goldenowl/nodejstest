import * as dotenv from 'dotenv';
import { User } from './src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

dotenv.config();
const configService = new ConfigService();

export default {
  type: 'postgres' as const,
  url: configService.get<string>('DATABASE_URL'),
  entities: [User],
  synchronize: true,
  logging: false,
  seeds: ['src/db/seeding/seeds/**/*{.ts,.js}'],
  factories: ['src/db/seeding/factories/**/*{.ts,.js}'],
};
