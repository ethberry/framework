import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { CoreEthType } from "@framework/types";

import type { IEthLoggerInOutDto } from "./interfaces";
import { ContractManagerServiceRmq } from "./contract-manager.service.rmq";

@Controller()
export class ContractManagerControllerRmq {
  constructor(private readonly contractManagerServiceRmq: ContractManagerServiceRmq) {}

  @EventPattern(CoreEthType.ADD_LISTENER)
  async addListener(@Payload() dto: IEthLoggerInOutDto): Promise<void> {
    return this.contractManagerServiceRmq.addListener(dto);
  }

  @EventPattern(CoreEthType.REMOVE_LISTENER)
  async removeListener(@Payload() dto: IEthLoggerInOutDto): Promise<void> {
    return this.contractManagerServiceRmq.removeListener(dto);
  }
}
