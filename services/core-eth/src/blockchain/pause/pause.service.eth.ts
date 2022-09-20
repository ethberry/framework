import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractEventType, IPausedEvent, TAccessListEventData } from "@framework/types";
import { ContractService } from "../hierarchy/contract/contract.service";
import { ContractHistoryService } from "../contract-history/contract-history.service";

@Injectable()
export class PauseServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly contractService: ContractService,
    private readonly contractHistoryService: ContractHistoryService,
  ) {}

  public async pause(event: ILogEvent<IPausedEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);

    const { address } = context;

    const contractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    Object.assign(contractEntity, { isPaused: !contractEntity.isPaused });
    await contractEntity.save();
  }

  private async updateHistory(event: ILogEvent<TAccessListEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), PauseServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address } = context;

    await this.contractHistoryService.create({
      address,
      transactionHash,
      eventType: name as ContractEventType,
      eventData: args,
    });
  }
}
