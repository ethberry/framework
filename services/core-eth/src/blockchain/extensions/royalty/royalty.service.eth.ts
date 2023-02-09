import { Injectable, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";
import { BigNumber } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import type { IDefaultRoyaltyInfoEvent, ITokenRoyaltyInfoEvent } from "@framework/types";

import { ContractHistoryService } from "../../hierarchy/contract/history/history.service";
import { ContractService } from "../../hierarchy/contract/contract.service";

@Injectable()
export class RoyaltyServiceEth {
  constructor(
    private readonly contractService: ContractService,
    private readonly contractHistoryService: ContractHistoryService,
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

    contractEntity.royalty = BigNumber.from(royaltyNumerator).toNumber();

    await contractEntity.save();

    await this.contractHistoryService.updateHistory(event, context);
  }

  public async tokenRoyaltyInfo(event: ILogEvent<ITokenRoyaltyInfoEvent>, context: Log): Promise<void> {
    await this.contractHistoryService.updateHistory(event, context);
  }
}
