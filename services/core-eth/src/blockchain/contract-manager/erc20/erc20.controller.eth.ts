import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IContractManagerERC20TokenDeployedEvent } from "@framework/types";
import { ContractManagerEventType } from "@framework/types";

import { ContractManagerErc20ServiceEth } from "./erc20.service.eth";
import { ContractType } from "../../../utils/contract-type";

@Controller()
export class ContractManagerErc20ControllerEth {
  constructor(private readonly contractManagerErc20ServiceEth: ContractManagerErc20ServiceEth) {}

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.ERC20TokenDeployed,
  })
  public deploy(@Payload() event: ILogEvent<IContractManagerERC20TokenDeployedEvent>, @Ctx() ctx: Log): Promise<void> {
    return this.contractManagerErc20ServiceEth.deploy(event, ctx);
  }
}
