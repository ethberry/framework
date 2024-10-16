import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IContractManagerERC20TokenDeployedEvent,
  IErc20TokenApproveEvent,
  IErc20TokenTransferEvent,
} from "@framework/types";
import { ContractManagerEventType, Erc20EventType } from "@framework/types";

import { Erc20TokenServiceEth } from "./token.service.eth";
import { ContractType } from "../../../../utils/contract-type";

@Controller()
export class Erc20TokenControllerEth {
  constructor(private readonly erc20TokenServiceEth: Erc20TokenServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC20_TOKEN, eventName: Erc20EventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IErc20TokenTransferEvent>, @Ctx() context: Log): Promise<void> {
    return this.erc20TokenServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC20_TOKEN, eventName: Erc20EventType.Approval })
  public approval(@Payload() event: ILogEvent<IErc20TokenApproveEvent>, @Ctx() context: Log): Promise<void> {
    return this.erc20TokenServiceEth.approval(event, context);
  }

  @EventPattern([
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.ERC20TokenDeployed },
  ])
  public deploy(
    @Payload() event: ILogEvent<IContractManagerERC20TokenDeployedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc20TokenServiceEth.deploy(event, context);
  }
}
