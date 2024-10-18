import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IContractManagerERC721TokenDeployedEvent } from "@framework/types";
import { ContractManagerEventType } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
import { ContractManagerErc721ServiceEth } from "./erc721.service.eth";

@Controller()
export class ContractManagerErc721ControllerEth {
  constructor(private readonly contractManagerErc721ServiceEth: ContractManagerErc721ServiceEth) {}

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.ERC721TokenDeployed,
  })
  public deploy(
    @Payload() event: ILogEvent<IContractManagerERC721TokenDeployedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.contractManagerErc721ServiceEth.deploy(event, context);
  }
}
