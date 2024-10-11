import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IBaseURIUpdateEvent, IContractManagerERC721TokenDeployedEvent } from "@framework/types";
import { BaseUrlEventType, ContractManagerEventType } from "@framework/types";

import { BaseUriServiceEth } from "./base-uri.service.eth";
import { ContractType } from "../../../utils/contract-type";

@Controller()
export class BaseUriControllerEth {
  constructor(private readonly baseUriServiceEth: BaseUriServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: BaseUrlEventType.BaseURIUpdate })
  public updateBaseUri(@Payload() event: ILogEvent<IBaseURIUpdateEvent>, @Ctx() context: Log): Promise<void> {
    return this.baseUriServiceEth.updateBaseUri(event, context);
  }

  @EventPattern([
    {
      contractType: ContractType.CONTRACT_MANAGER,
      eventName: ContractManagerEventType.ERC721TokenDeployed,
    },
    {
      contractType: ContractType.CONTRACT_MANAGER,
      eventName: ContractManagerEventType.ERC998TokenDeployed,
    },
    {
      contractType: ContractType.CONTRACT_MANAGER,
      eventName: ContractManagerEventType.ERC1155TokenDeployed,
    },
  ])
  public erc721Token(
    @Payload() event: ILogEvent<IContractManagerERC721TokenDeployedEvent>,
    @Ctx() ctx: Log,
  ): Promise<void> {
    return this.baseUriServiceEth.deploy(event, ctx);
  }
}
