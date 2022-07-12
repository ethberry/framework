import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  MarketplaceEventType,
  IMarketplaceRedeemCommon,
  IMarketplaceRedeemDropbox,
  TMarketplaceEventData,
} from "@framework/types";

import { MarketplaceHistoryService } from "./marketplace-history/marketplace-history.service";
import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";
import { TokenService } from "../../blockchain/hierarchy/token/token.service";

@Injectable()
export class MarketplaceServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly contractManagerService: ContractManagerService,
    private readonly tokenService: TokenService,
    private readonly marketplaceHistoryService: MarketplaceHistoryService,
  ) {}

  public async redeemCommon(event: ILogEvent<IMarketplaceRedeemCommon>, context: Log): Promise<void> {
    this.loggerService.log(JSON.stringify(event, null, "\t"), MarketplaceServiceEth.name);
    await this.updateHistory(event, context);
  }

  public async redeemDropbox(event: ILogEvent<IMarketplaceRedeemDropbox>, context: Log): Promise<void> {
    this.loggerService.log(JSON.stringify(event, null, "\t"), MarketplaceServiceEth.name);
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TMarketplaceEventData>, context: Log) {
    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.marketplaceHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: name as MarketplaceEventType,
      eventData: args,
      // todo unpack struct IAsset
      // erc721TokenId,
    });

    // const {
    //   args,
    //   args: { tokenIds },
    //   name,
    // } = event;
    //
    // const { transactionHash, address, blockNumber } = context;

    // await Promise.all(
    //   tokenIds.map(async (token, indx) => {
    //     // Check existence of all tokenIds
    //     const TokenEntity = await this.tokenService.findOne({ id: ~~token });
    //     if (!TokenEntity) {
    //       throw new NotFoundException("tokenNotFound");
    //     }
    //     await this.marketplaceHistoryService.create({
    //       address: address.toLowerCase(),
    //       transactionHash: transactionHash.toLowerCase(),
    //       eventType: name as MarketplaceEventType,
    //       eventData: {
    //         from: args.from,
    //         collection: args.collection,
    //         tokenId: args.tokenIds[indx],
    //         amount: args.amounts[indx],
    //         price: args.price,
    //       },
    //       tokenId: TokenEntity.id,
    //     });
    //   }),
    // );

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
