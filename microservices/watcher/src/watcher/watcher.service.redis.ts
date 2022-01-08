import { Injectable } from "@nestjs/common";
import { Redis } from "ioredis";
import { InjectRedis } from "@liaoliaots/nestjs-redis";

import { WATCHER_STORE } from "../common/constants";

@Injectable()
export class WatcherServiceRedis {
  constructor(
    @InjectRedis(WATCHER_STORE)
    private readonly redis: Redis,
  ) {}

  public async getRecord(key: string): Promise<[string, Array<string>]> {
    return this.redis.scan(0, "MATCH", key, "COUNT", 1000);
  }

  public async addRecord(key: string, value: string): Promise<void> {
    await this.redis.set(key, value);
  }

  public async delRecord(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
