import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";
import { BigNumber } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractEventType } from "@framework/types";
import type { IDefaultRoyaltyInfo, ITokenRoyaltyInfo, TContractEventData } from "@framework/types";

import { ContractHistoryService } from "../contract-history/contract-history.service";
import { ContractService } from "../hierarchy/contract/contract.service";

@Injectable()
export class RoyaltyServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly contractService: ContractService,
    private readonly contractHistoryService: ContractHistoryService,
  ) {}

  public async defaultRoyaltyInfo(event: ILogEvent<IDefaultRoyaltyInfo>, context: Log): Promise<void> {
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

    await this.updateHistory(event, context);
  }

  public async tokenRoyaltyInfo(event: ILogEvent<ITokenRoyaltyInfo>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TContractEventData>, context: Log, erc998TokenId?: number) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), RoyaltyServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.contractHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: name as ContractEventType,
      eventData: args,
      // ApprovedForAll has no tokenId
      tokenId: erc998TokenId || null,
    });

    await this.contractService.updateLastBlockByAddr(address.toLowerCase(), parseInt(blockNumber.toString(), 16));
  }
}
