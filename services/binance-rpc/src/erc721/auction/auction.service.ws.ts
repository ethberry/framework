import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import {
  Erc721AuctionEventType,
  Erc721AuctionStatus,
  Erc721TokenStatus,
  IErc721AuctionBid,
  IErc721AuctionFinish,
  IErc721AuctionStart,
  TErc721AuctionEventData,
} from "@framework/types";
import { IEvent } from "@gemunion/nestjs-web3";

import { Erc721TokenService } from "../token/token.service";

import { Erc721AuctionService } from "./auction.service";
import { Erc721AuctionHistoryService } from "../auction-history/auction-history.service";

@Injectable()
export class Erc721AuctionServiceWs {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly erc721AuctionService: Erc721AuctionService,
    private readonly erc721TokenService: Erc721TokenService,
    private readonly erc721AuctionHistoryService: Erc721AuctionHistoryService,
  ) {}

  public async startAuction(event: IEvent<IErc721AuctionStart>): Promise<void> {
    const {
      returnValues: {
        collection,
        tokenId,
        auctionId,
        startPrice,
        buyoutPrice,
        bidStep,
        startTimestamp,
        finishTimestamp,
        owner,
      },
    } = event;

    const erc721TokenEntity = await this.erc721TokenService.getToken(
      tokenId,
      collection.toLowerCase(),
      Erc721TokenStatus.MINTED,
    );

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.erc721AuctionService.create({
      owner: owner.toLowerCase(),
      auctionId,
      startPrice,
      buyoutPrice,
      bidStep,
      price: startPrice, // Initial price
      erc721Collection: erc721TokenEntity.erc721Template.erc721Collection,
      erc721Token: erc721TokenEntity,
      startTimestamp: new Date(~~`${startTimestamp}000`).toISOString(),
      finishTimestamp: new Date(~~`${finishTimestamp}000`).toISOString(),
    });

    await this.updateHistory(event);
  }

  public async bidAuction(event: IEvent<IErc721AuctionBid>): Promise<void> {
    const {
      returnValues: { auctionId, amount },
    } = event;

    await this.updateHistory(event);

    await this.erc721AuctionService.update({ auctionId }, { price: amount });
  }

  public async finishAuction(event: IEvent<IErc721AuctionFinish>): Promise<void> {
    const {
      returnValues: { auctionId },
    } = event;

    await this.updateHistory(event);

    await this.erc721AuctionService.update({ auctionId }, { auctionStatus: Erc721AuctionStatus.FINISHED });
  }

  private async updateHistory(event: IEvent<TErc721AuctionEventData>) {
    this.loggerService.log(JSON.stringify(event, null, "\t"));

    const {
      returnValues,
      returnValues: { auctionId },
      event: eventType,
      transactionHash,
      address,
    } = event;

    const auctionEntity = await this.erc721AuctionService.findOne({ auctionId });

    if (!auctionEntity) {
      this.loggerService.warn("Suspicious event!");
    }

    await this.erc721AuctionHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: eventType as Erc721AuctionEventType,
      eventData: returnValues,
      erc721AuctionId: auctionEntity ? auctionEntity.id : null,
    });
  }
}
