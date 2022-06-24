import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractType, Erc998MarketplaceEventType, IErc998MarketplaceRedeem } from "@framework/types";

import { Erc998MarketplaceServiceEth } from "./marketplace.service.eth";

@Controller()
export class Erc998MarketplaceControllerEth {
  constructor(private readonly erc998MarketplaceServiceEth: Erc998MarketplaceServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC998_MARKETPLACE, eventName: Erc998MarketplaceEventType.Redeem })
  public purchaseToken(@Payload() event: ILogEvent<IErc998MarketplaceRedeem>, @Ctx() context: Log): Promise<void> {
    return this.erc998MarketplaceServiceEth.redeem(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_MARKETPLACE, eventName: Erc998MarketplaceEventType.RedeemDropbox })
  public purchaseDropbox(@Payload() event: ILogEvent<IErc998MarketplaceRedeem>, @Ctx() context: Log): Promise<void> {
    return this.erc998MarketplaceServiceEth.redeemDropbox(event, context);
  }
}
