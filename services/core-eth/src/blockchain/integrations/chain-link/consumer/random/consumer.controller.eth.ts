import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IContractManagerERC721TokenDeployedEvent, IERC721TokenMintRandomEvent } from "@framework/types";
import { ChainLinkEventType, ContractManagerEventType } from "@framework/types";

import { ContractType } from "../../../../../utils/contract-type";
import { ChainLinkConsumerServiceEth } from "./consumer.service.eth";

@Controller()
export class ChainLinkConsumerControllerEth {
  constructor(private readonly chainLinkConsumerServiceEth: ChainLinkConsumerServiceEth) {}

  @EventPattern({ contractType: ContractType.VRF_RANDOM, eventName: ChainLinkEventType.MintRandom })
  public mintRandom(@Payload() event: ILogEvent<IERC721TokenMintRandomEvent>, @Ctx() context: Log): Promise<void> {
    return this.chainLinkConsumerServiceEth.mintRandom(event, context);
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
  ])
  public erc721Token(
    @Payload() event: ILogEvent<IContractManagerERC721TokenDeployedEvent>,
    @Ctx() ctx: Log,
  ): Promise<void> {
    return this.chainLinkConsumerServiceEth.deploy(event, ctx);
  }
}
