import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IContractManagerERC998TokenDeployedEvent } from "@framework/types";
import { ContractManagerEventType } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
import { ContractManagerErc998ServiceEth } from "./erc998.service.eth";

@Controller()
export class ContractManagerControllerEth {
  constructor(private readonly contractManagerErc998ServiceEth: ContractManagerErc998ServiceEth) {}

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.ERC998TokenDeployed,
  })
  public erc998Token(
    @Payload() event: ILogEvent<IContractManagerERC998TokenDeployedEvent>,
    @Ctx() ctx: Log,
  ): Promise<void> {
    return this.contractManagerErc998ServiceEth.erc998Token(event, ctx);
  }
}
