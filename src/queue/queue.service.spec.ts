import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { commonConfig } from '../config/common';
import { BirthdayJobData } from '../type/BirthdayJobData';

describe('QueueService', () => {
  let service: QueueService;
  let taskQueueMock: Queue;

  beforeEach(async () => {
    taskQueueMock = {
      add: jest.fn(),
    } as unknown as Queue;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        {
          provide: getQueueToken('taskQueue'),
          useValue: taskQueueMock,
        },
        Logger,
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addSendBirtdayMessage', () => {
    it('should add a job to the taskQueue with the correct options', async () => {
      const data: BirthdayJobData = {
        users: [
          {
            id: 1,
            email: 'Audreanne_Ledner@gmail.com',
            lastname: 'John',
            firstname: 'Doe',
            birthday: new Date('2024-12-10'),
            locations: {
              city: 'New York',
              country: 'United States',
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            email: 'Brando_Nolan44@yahoo.com',
            lastname: 'Jane',
            firstname: ' Smith',
            birthday: new Date('2024-06-15'),
            locations: {
              city: 'Paris',
              country: 'France',
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };
      const expectedOptions = {
        attempts: commonConfig.queue.retryCount,
        backoff: {
          type: 'fixed',
          delay: commonConfig.queue.delay,
        },
        timeout: commonConfig.queue.timeout,
      };

      await service.addSendBirtdayMessage(data);

      expect(taskQueueMock.add).toHaveBeenCalledWith(
        'processSendBirtdayMessage',
        data,
        expectedOptions,
      );
    });
  });
});
