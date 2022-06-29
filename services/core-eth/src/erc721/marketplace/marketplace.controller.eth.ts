import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractType, Erc721MarketplaceEventType, IErc721MarketplaceRedeem } from "@framework/types";

import { Erc721MarketplaceServiceEth } from "./marketplace.service.eth";

@Controller()
export class Erc721MarketplaceControllerEth {
  constructor(private readonly erc721MarketplaceServiceEth: Erc721MarketplaceServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC721_MARKETPLACE, eventName: Erc721MarketplaceEventType.Redeem })
  public purchaseToken(@Payload() event: ILogEvent<IErc721MarketplaceRedeem>, @Ctx() context: Log): Promise<void> {
    return this.erc721MarketplaceServiceEth.redeem(event, context);
  }

  // @EventPattern({ contractType: ContractType.ERC721_MARKETPLACE, eventName: Erc721MarketplaceEventType.RedeemDropbox })
  // public purchaseDropbox(@Payload() event: ILogEvent<IErc721MarketplaceRedeem>, @Ctx() context: Log): Promise<void> {
  //   return this.erc721MarketplaceServiceEth.redeemDropbox(event, context);
  // }
}
