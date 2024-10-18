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

  @EventPattern({ contractType: ContractType.VRF_GENES, eventName: ChainLinkEventType.MintGenes })
  public mintRandom(@Payload() event: ILogEvent<IERC721TokenMintRandomEvent>, @Ctx() context: Log): Promise<void> {
    return this.chainLinkConsumerServiceEth.mintGenes(event, context);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.ERC721TokenDeployed,
  })
  public deploy(@Payload() event: ILogEvent<IContractManagerERC721TokenDeployedEvent>): void {
    return this.chainLinkConsumerServiceEth.deploy(event);
  }
}
