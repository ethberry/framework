import { Injectable, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IPausedEvent } from "@framework/types";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { ContractHistoryService } from "../../hierarchy/contract/history/history.service";

@Injectable()
export class PauseServiceEth {
  constructor(
    private readonly contractService: ContractService,
    private readonly contractHistoryService: ContractHistoryService,
  ) {}

  public async pause(event: ILogEvent<IPausedEvent>, context: Log): Promise<void> {
    await this.contractHistoryService.updateHistory(event, context);

    const { address } = context;

    const contractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    Object.assign(contractEntity, { isPaused: !contractEntity.isPaused });
    await contractEntity.save();
  }
}
