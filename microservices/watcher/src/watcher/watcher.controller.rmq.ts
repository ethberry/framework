import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { WatcherServiceRmq } from "./watcher.service.rmq";
import { WatcherInType } from "../common/constants";
import { WatcherEntity } from "./watcher.entity";
import { TransactionCreateDto, TransactionRemoveDto } from "./dto";

@Controller()
export class WatcherControllerRmq {
  constructor(private readonly watcherServiceRmq: WatcherServiceRmq) {}

  @EventPattern(WatcherInType.CREATE_TRANSACTION_LISTENER)
  public createListener(@Payload() dto: TransactionCreateDto): Promise<WatcherEntity> {
    return this.watcherServiceRmq.createListener(dto);
  }

  @EventPattern(WatcherInType.REMOVE_TRANSACTION_LISTENER)
  public removeListener(@Payload() dto: TransactionRemoveDto): Promise<WatcherEntity> {
    return this.watcherServiceRmq.removeListener(dto);
  }
}
