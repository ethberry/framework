import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { IEvent } from "@gemunion/nestjs-web3";
import { Erc721MarketplaceEventType, IErc721MarketplaceRedeem, ContractType } from "@framework/types";

import { Erc721MarketplaceServiceWs } from "./marketplace.service.ws";

@Controller()
export class Erc721MarketplaceControllerWs {
  constructor(private readonly erc721MarketplaceServiceWs: Erc721MarketplaceServiceWs) {}

  @EventPattern({ contractType: ContractType.ERC721_MARKETPLACE, eventName: Erc721MarketplaceEventType.Redeem })
  public purchaseToken(@Payload() event: IEvent<IErc721MarketplaceRedeem>): Promise<void> {
    return this.erc721MarketplaceServiceWs.redeem(event);
  }

  @EventPattern({ contractType: ContractType.ERC721_MARKETPLACE, eventName: Erc721MarketplaceEventType.RedeemDropbox })
  public purchaseDropbox(@Payload() event: IEvent<IErc721MarketplaceRedeem>): Promise<void> {
    return this.erc721MarketplaceServiceWs.redeemDropbox(event);
  }
}
