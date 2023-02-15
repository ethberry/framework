import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";

import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import type {
  IOwnershipTransferredEvent,
  IVestingERC20ReleasedEvent,
  IVestingEtherReceivedEvent,
  IVestingEtherReleasedEvent,
} from "@framework/types";

import { ContractService } from "../../hierarchy/contract/contract.service";
import { EventHistoryService } from "../../event-history/event-history.service";

@Injectable()
export class VestingServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly contractService: ContractService,
  ) {}

  public async erc20Released(event: ILogEvent<IVestingERC20ReleasedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }

  public async ethReleased(event: ILogEvent<IVestingEtherReleasedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }

  public async ethReceived(event: ILogEvent<IVestingEtherReceivedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }

  public async ownershipChanged(event: ILogEvent<IOwnershipTransferredEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const { args } = event;
    const { previousOwner, newOwner } = args;
    const { address } = context;

    const vestingEntity = await this.contractService.findOne({ address: address.toLowerCase() });
    if (!vestingEntity) {
      throw new NotFoundException("vestingNotFound");
    }

    // TODO simplify
    const vestingParams = vestingEntity.parameters;
    if (vestingParams.account && vestingParams.account === previousOwner.toLowerCase()) {
      Object.assign(vestingParams, { account: newOwner.toLowerCase() });
      Object.assign(vestingEntity, { parameters: vestingParams });
      await vestingEntity.save();
    }
  }
}
