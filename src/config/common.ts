export const commonConfig: TCommonConfig = {
  user: {
    notifyTime: 9,
  },
  queue: {
    retryCount: 3,
    backoff: 5000,
    delay: 1000,
    timeout: 10000,
  },
  chunk: 100,
};

export type TCommonConfig = {
  user: {
    notifyTime: number;
  };
  queue: {
    retryCount: number;
    backoff: number;
    delay: number;
    timeout: number;
  };
  chunk: number;
};
