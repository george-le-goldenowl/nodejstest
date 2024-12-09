import { Injectable } from '@nestjs/common';
import * as http from 'http';

@Injectable()
export class HttpClient {
  request(options: http.RequestOptions, data: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(responseData);
          } else {
            reject(
              new Error(`Request failed with status code ${res.statusCode}`),
            );
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(data);
      req.end();
    });
  }
}
