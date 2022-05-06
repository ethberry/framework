import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";

import { IEvent } from "@gemunion/nestjs-web3";
import { Erc1155MarketplaceEventType, IErc1155MarketplaceRedeem, TErc1155MarketplaceEventData } from "@framework/types";

import { Erc1155TokenService } from "../token/token.service";
import { Erc1155MarketplaceHistoryService } from "../marketplace-history/marketplace-history.service";

@Injectable()
export class Erc1155MarketplaceServiceWs {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly erc1155TokenService: Erc1155TokenService,
    private readonly erc1155MarketplaceHistoryService: Erc1155MarketplaceHistoryService,
  ) {}

  public async redeem(event: IEvent<IErc1155MarketplaceRedeem>): Promise<void> {
    this.loggerService.log(JSON.stringify(event, null, "\t"));
    await this.updateHistory(event);
  }

  private async updateHistory(event: IEvent<TErc1155MarketplaceEventData>) {
    const {
      returnValues,
      returnValues: { tokenIds },
      event: eventType,
      transactionHash,
      address,
    } = event;

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
          eventType: eventType as Erc1155MarketplaceEventType,
          eventData: {
            from: returnValues.from,
            collection: returnValues.collection,
            tokenId: returnValues.tokenIds[indx],
            amount: returnValues.amounts[indx],
            price: returnValues.price,
          },
          erc1155TokenId: erc1155TokenEntity.id,
        });
      }),
    );
  }
}
