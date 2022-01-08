import { Injectable } from "@nestjs/common";

import { ITransactionCreateDto, ITransactionRemoveDto } from "./interfaces";
import { WatcherEntity } from "./watcher.entity";
import { WatcherService } from "./watcher.service";

@Injectable()
export class WatcherServiceRmq {
  constructor(private readonly watcherService: WatcherService) {}

  public createListener(dto: ITransactionCreateDto): Promise<WatcherEntity> {
    return this.watcherService.create(dto);
  }

  public removeListener(dto: ITransactionRemoveDto): Promise<WatcherEntity> {
    return this.watcherService.delete(dto);
  }
}
