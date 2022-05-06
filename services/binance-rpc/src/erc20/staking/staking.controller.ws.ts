import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { IEvent } from "@gemunion/nestjs-web3";
import { Erc20StakingEventType, IErc20StakingDeposit, IErc20StakingWithdraw } from "@framework/types";

import { ContractType } from "../../common/interfaces";
import { Erc20StakingServiceWs } from "./staking.service.ws";

@Controller()
export class Erc20StakingControllerWs {
  constructor(private readonly erc20StakingServiceWs: Erc20StakingServiceWs) {}

  @EventPattern({ contractName: ContractType.ERC20_STAKING, eventName: Erc20StakingEventType.StakingStart })
  public transfer(@Payload() event: IEvent<IErc20StakingDeposit>): Promise<void> {
    return this.erc20StakingServiceWs.start(event);
  }

  @EventPattern({ contractName: ContractType.ERC20_STAKING, eventName: Erc20StakingEventType.StakingWithdraw })
  public approval(@Payload() event: IEvent<IErc20StakingWithdraw>): Promise<void> {
    return this.erc20StakingServiceWs.withdraw(event);
  }
}
