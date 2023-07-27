import { Injectable, NotFoundException } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IDefaultRoyaltyInfoEvent, ITokenRoyaltyInfoEvent } from "@framework/types";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { EventHistoryService } from "../../event-history/event-history.service";

@Injectable()
export class RoyaltyServiceEth {
  constructor(
    private readonly contractService: ContractService,
    private readonly eventHistoryService: EventHistoryService,
  ) {}

  public async defaultRoyaltyInfo(event: ILogEvent<IDefaultRoyaltyInfoEvent>, context: Log): Promise<void> {
    const {
      args: { royaltyNumerator },
    } = event;

    const contractEntity = await this.contractService.findOne({
      address: context.address.toLowerCase(),
    });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    contractEntity.royalty = Number(royaltyNumerator);

    await contractEntity.save();

    await this.eventHistoryService.updateHistory(event, context);
  }

  public async tokenRoyaltyInfo(event: ILogEvent<ITokenRoyaltyInfoEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }
}
