export interface IBeeQueueJobData {
  route: string;
  decoded: any;
  context: any; // Log from "ethers"?
}

export interface IBeeQueueJob {
  id: string;
  data: IBeeQueueJobData;
}

export interface IBeeQueueJobConfig {
  id?: string;
  retries?: number;
  backoff?: {
    strategy: string;
    delayFactor: number;
  };
  delayUntil?: Date | number;
  timeoutMs?: number;
}
