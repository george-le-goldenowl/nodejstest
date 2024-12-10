import { Injectable } from '@nestjs/common';
import { HttpClient } from '../libs/https/HttpClient';
import { pipedreamOptions } from '../../src/config/pipedream';

@Injectable()
export class PipedreamService {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Send a message to a Pipedream endpoint.
   * @param message the message to be sent
   * @returns the response from the Pipedream endpoint
   */
  async sendMessageToPipedream<T>(message: T): Promise<any> {
    const data = JSON.stringify(message);
    const options = pipedreamOptions;

    try {
      const response = await this.httpClient.request(
        {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length.toString(),
          },
        },
        data,
      );

      return JSON.parse(response);
    } catch (error) {
      console.error('Error sending message to Pipedream:', error);
    }
  }
}
