import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { BaseUrlEventType, ContractType, IBaseURIUpdateEvent } from "@framework/types";

import { BaseUriServiceEth } from "./base-uri.service.eth";

@Controller()
export class BaseUriControllerEth {
  constructor(private readonly baseUriServiceEth: BaseUriServiceEth) {}

  @EventPattern([
    {
      contractType: ContractType.ERC1155_TOKEN,
      eventName: BaseUrlEventType.BaseURIUpdate,
    },
    {
      contractType: ContractType.ERC998_TOKEN,
      eventName: BaseUrlEventType.BaseURIUpdate,
    },
    {
      contractType: ContractType.ERC998_TOKEN_RANDOM,
      eventName: BaseUrlEventType.BaseURIUpdate,
    },
    {
      contractType: ContractType.ERC721_TOKEN,
      eventName: BaseUrlEventType.BaseURIUpdate,
    },
    {
      contractType: ContractType.ERC721_TOKEN_RANDOM,
      eventName: BaseUrlEventType.BaseURIUpdate,
    },
    { contractType: ContractType.MYSTERY, eventName: BaseUrlEventType.BaseURIUpdate },
    { contractType: ContractType.WRAPPER, eventName: BaseUrlEventType.BaseURIUpdate },
    { contractType: ContractType.LOTTERY, eventName: BaseUrlEventType.BaseURIUpdate },
    { contractType: ContractType.RAFFLE, eventName: BaseUrlEventType.BaseURIUpdate },
  ])
  public updateBaseUri(@Payload() event: ILogEvent<IBaseURIUpdateEvent>, @Ctx() context: Log): Promise<void> {
    return this.baseUriServiceEth.updateBaseUri(event, context);
  }
}
