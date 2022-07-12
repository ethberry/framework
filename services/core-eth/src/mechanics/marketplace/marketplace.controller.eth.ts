import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  MarketplaceEventType,
  IMarketplaceRedeemCommon,
  IMarketplaceRedeemDropbox,
} from "@framework/types";

import { MarketplaceServiceEth } from "./marketplace.service.eth";

@Controller()
export class MarketplaceControllerEth {
  constructor(private readonly erc1155MarketplaceServiceEth: MarketplaceServiceEth) {}

  @EventPattern({ contractType: ContractType.MARKETPLACE, eventName: MarketplaceEventType.RedeemCommon })
  public purchaseCommon(@Payload() event: ILogEvent<IMarketplaceRedeemCommon>, @Ctx() context: Log): Promise<void> {
    return this.erc1155MarketplaceServiceEth.redeemCommon(event, context);
  }

  @EventPattern({ contractType: ContractType.MARKETPLACE, eventName: MarketplaceEventType.RedeemDropbox })
  public purchaseDropbox(@Payload() event: ILogEvent<IMarketplaceRedeemDropbox>, @Ctx() context: Log): Promise<void> {
    return this.erc1155MarketplaceServiceEth.redeemDropbox(event, context);
  }
}
