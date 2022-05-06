import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { IEvent } from "@gemunion/nestjs-web3";
import { Erc1155MarketplaceEventType, IErc1155MarketplaceRedeem } from "@framework/types";

import { ContractType } from "../../common/interfaces";
import { Erc1155MarketplaceServiceWs } from "./marketplace.service.ws";

@Controller()
export class Erc1155MarketplaceControllerWs {
  constructor(private readonly erc1155MarketplaceServiceWs: Erc1155MarketplaceServiceWs) {}

  @EventPattern({ contractName: ContractType.ERC1155_MARKETPLACE, eventName: Erc1155MarketplaceEventType.Redeem })
  public purchaseToken(@Payload() event: IEvent<IErc1155MarketplaceRedeem>): Promise<void> {
    return this.erc1155MarketplaceServiceWs.redeem(event);
  }
}
