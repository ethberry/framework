import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { IEvent } from "@gemunion/nestjs-web3";
import { Erc721AuctionEventType, IErc721AuctionBid, IErc721AuctionFinish, IErc721AuctionStart } from "@framework/types";

import { ContractType } from "../../common/interfaces";
import { Erc721AuctionServiceWs } from "./auction.service.ws";

@Controller()
export class Erc721AuctionControllerWs {
  constructor(private readonly auctionServiceWs: Erc721AuctionServiceWs) {}

  @EventPattern({ contractName: ContractType.ERC721_AUCTION, eventName: Erc721AuctionEventType.AuctionStart })
  public start(@Payload() event: IEvent<IErc721AuctionStart>): Promise<void> {
    return this.auctionServiceWs.startAuction(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_AUCTION, eventName: Erc721AuctionEventType.AuctionBid })
  public bid(@Payload() event: IEvent<IErc721AuctionBid>): Promise<void> {
    return this.auctionServiceWs.bidAuction(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_AUCTION, eventName: Erc721AuctionEventType.AuctionFinish })
  public finish(@Payload() event: IEvent<IErc721AuctionFinish>): Promise<void> {
    return this.auctionServiceWs.finishAuction(event);
  }
}
