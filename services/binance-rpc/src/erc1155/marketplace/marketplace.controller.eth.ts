import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractType, Erc1155MarketplaceEventType, IErc1155MarketplaceRedeem } from "@framework/types";

import { Erc1155MarketplaceServiceEth } from "./marketplace.service.eth";

@Controller()
export class Erc1155MarketplaceControllerEth {
  constructor(private readonly erc1155MarketplaceServiceEth: Erc1155MarketplaceServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC1155_MARKETPLACE, eventName: Erc1155MarketplaceEventType.Redeem })
  public purchaseToken(@Payload() event: ILogEvent<IErc1155MarketplaceRedeem>, @Ctx() context: Log): Promise<void> {
    return this.erc1155MarketplaceServiceEth.redeem(event, context);
  }
}
