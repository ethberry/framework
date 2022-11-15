import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { IEthLoggerInOutDto } from "./interfaces";
import { RmqProviderType } from "@framework/types";
import { ContractManagerServiceRmq } from "./contract-manager.service.rmq";

@Controller()
export class ContractManagerControllerRmq {
  constructor(private readonly contractManagerServiceRmq: ContractManagerServiceRmq) {}

  @EventPattern(RmqProviderType.WATCHER_IN_SERVICE)
  async loggerIn(@Payload() dto: IEthLoggerInOutDto): Promise<void> {
    return this.contractManagerServiceRmq.loggerIn(dto);
  }

  @EventPattern(RmqProviderType.WATCHER_OUT_SERVICE)
  async loggerOut(@Payload() dto: IEthLoggerInOutDto): Promise<void> {
    return this.contractManagerServiceRmq.loggerOut(dto);
  }
}
