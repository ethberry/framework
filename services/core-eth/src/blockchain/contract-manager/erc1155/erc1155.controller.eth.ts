import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IContractManagerERC1155TokenDeployedEvent } from "@framework/types";
import { ContractManagerEventType } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
import { ContractManagerErc1155ServiceEth } from "./erc1155.service.eth";

@Controller()
export class ContractManagerErc1155ControllerEth {
  constructor(private readonly contractManagerErc1155ServiceEth: ContractManagerErc1155ServiceEth) {}

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.ERC1155TokenDeployed,
  })
  public deploy(
    @Payload() event: ILogEvent<IContractManagerERC1155TokenDeployedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.contractManagerErc1155ServiceEth.deploy(event, context);
  }
}
