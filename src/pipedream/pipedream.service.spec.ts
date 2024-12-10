import { Test, TestingModule } from '@nestjs/testing';
import { PipedreamService } from './pipedream.service';
import { HttpClient } from '../libs/https/HttpClient';
import { pipedreamOptions } from '../../src/config/pipedream';

jest.mock('../libs/https/HttpClient');

describe('PipedreamService', () => {
  let service: PipedreamService;
  let httpClient: HttpClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PipedreamService,
        {
          provide: HttpClient,
          useValue: {
            request: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PipedreamService>(PipedreamService);
    httpClient = module.get<HttpClient>(HttpClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMessageToPipedream', () => {
    it('should send a message to the Pipedream endpoint and return the response', async () => {
      const message = { key: 'value' };
      const mockResponse = JSON.stringify({ success: true });
      jest.spyOn(httpClient, 'request').mockResolvedValueOnce(mockResponse);

      const result = await service.sendMessageToPipedream(message);

      expect(httpClient.request).toHaveBeenCalledWith(
        {
          ...pipedreamOptions,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(message).length.toString(),
          },
        },
        JSON.stringify(message),
      );
      expect(result).toEqual(JSON.parse(mockResponse));
    });

    it('should handle errors when sending a message to the Pipedream endpoint', async () => {
      const message = { key: 'value' };
      const error = new Error('Network error');
      jest.spyOn(httpClient, 'request').mockRejectedValueOnce(error);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await service.sendMessageToPipedream(message);

      expect(httpClient.request).toHaveBeenCalledWith(
        {
          ...pipedreamOptions,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(message).length.toString(),
          },
        },
        JSON.stringify(message),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error sending message to Pipedream:',
        error,
      );
      expect(result).toBeUndefined();

      consoleErrorSpy.mockRestore();
    });
  });
});
