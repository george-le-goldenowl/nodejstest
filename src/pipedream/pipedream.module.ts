import { Module } from '@nestjs/common';
import { PipedreamService } from './pipedream.service';
import { HttpClient } from '../libs/https/HttpClient';

@Module({
  providers: [PipedreamService, HttpClient],
  exports: [PipedreamService],
})
export class PipedreamModule {}
