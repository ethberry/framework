import { Injectable, NotFoundException } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import { IPausedEvent } from "@framework/types";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { EventHistoryService } from "../../event-history/event-history.service";

@Injectable()
export class PauseServiceEth {
  constructor(
    private readonly contractService: ContractService,
    private readonly eventHistoryService: EventHistoryService,
  ) {}

  public async pause(event: ILogEvent<IPausedEvent>, context: Log): Promise<void> {
    await this.toggle(event, context, true);
  }

  public async unpause(event: ILogEvent<IPausedEvent>, context: Log): Promise<void> {
    await this.toggle(event, context, false);
  }

  public async toggle(event: ILogEvent<IPausedEvent>, context: Log, isPaused: boolean): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);

    const { address } = context;

    const contractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    Object.assign(contractEntity, { isPaused });
    await contractEntity.save();
  }
}
