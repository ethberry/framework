import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IContractManagerWaitListDeployedEvent } from "@framework/types";
import { ContractManagerEventType } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
import { ContractManagerWaitListServiceEth } from "./wait-list.service.eth";

@Controller()
export class ContractManagerWaitListControllerEth {
  constructor(private readonly contractManagerWaitListServiceEth: ContractManagerWaitListServiceEth) {}

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.WaitListDeployed,
  })
  public deploy(@Payload() event: ILogEvent<IContractManagerWaitListDeployedEvent>, @Ctx() ctx: Log): Promise<void> {
    return this.contractManagerWaitListServiceEth.deploy(event, ctx);
  }
}
