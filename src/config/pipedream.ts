import { ConfigService } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });
const configService = new ConfigService();

export const pipedreamOptions = {
  hostname: configService.get<string>('PD_HOSTNAME'),
  port: parseInt(configService.get<string>('PD_PORT'), 10),
  path: configService.get<string>('PD_PATH'),
  method: 'POST',
};
