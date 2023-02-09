import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import type { IChainLinkRandomRequestEvent } from "@framework/types";
import { ContractEventType, ContractType } from "@framework/types";

import { ChainLinkServiceEth } from "./chain-link.service.eth";

@Controller()
export class ChainLinkControllerEth {
  constructor(private readonly chainLinkServiceEth: ChainLinkServiceEth) {}

  @EventPattern([
    { contractType: ContractType.ERC721_TOKEN, eventName: ContractEventType.RandomRequest },
    { contractType: ContractType.ERC998_TOKEN, eventName: ContractEventType.RandomRequest },
    { contractType: ContractType.LOTTERY, eventName: ContractEventType.RandomRequest },
  ])
  public randomRequest1(@Payload() event: ILogEvent<IChainLinkRandomRequestEvent>, @Ctx() context: Log): Promise<void> {
    return this.chainLinkServiceEth.randomRequest(event, context);
  }
}
