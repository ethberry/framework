import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import { Erc1155MarketplaceEventType, IErc1155MarketplaceRedeem, TErc1155MarketplaceEventData } from "@framework/types";

import { Erc1155TokenService } from "../token/token.service";
import { Erc1155MarketplaceHistoryService } from "./marketplace-history/marketplace-history.service";
import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";

@Injectable()
export class Erc1155MarketplaceServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly contractManagerService: ContractManagerService,
    private readonly erc1155TokenService: Erc1155TokenService,
    private readonly erc1155MarketplaceHistoryService: Erc1155MarketplaceHistoryService,
  ) {}

  public async redeem(event: ILogEvent<IErc1155MarketplaceRedeem>, context: Log): Promise<void> {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc1155MarketplaceServiceEth.name);
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TErc1155MarketplaceEventData>, context: Log) {
    const {
      args,
      args: { tokenIds },
      name,
    } = event;

    const { transactionHash, address, blockNumber } = context;

    await Promise.all(
      tokenIds.map(async (token, indx) => {
        // Check existence of all tokenIds
        const erc1155TokenEntity = await this.erc1155TokenService.findOne({ id: ~~token });
        if (!erc1155TokenEntity) {
          throw new NotFoundException("tokenNotFound");
        }
        await this.erc1155MarketplaceHistoryService.create({
          address: address.toLowerCase(),
          transactionHash: transactionHash.toLowerCase(),
          eventType: name as Erc1155MarketplaceEventType,
          eventData: {
            from: args.from,
            collection: args.collection,
            tokenId: args.tokenIds[indx],
            amount: args.amounts[indx],
            price: args.price,
          },
          uniTokenId: erc1155TokenEntity.id,
        });
      }),
    );

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
