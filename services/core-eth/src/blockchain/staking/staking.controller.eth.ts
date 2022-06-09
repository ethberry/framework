import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractType, StakingEventType, IStakingDeposit, IStakingWithdraw } from "@framework/types";

import { StakingServiceEth } from "./staking.service.eth";

@Controller()
export class StakingControllerEth {
  constructor(private readonly stakingServiceEth: StakingServiceEth) {}
  @EventPattern({ contractType: ContractType.ERC20_STAKING, eventName: StakingEventType.StakingStart })
  public transfer(@Payload() event: ILogEvent<IStakingDeposit>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.start(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC20_STAKING, eventName: StakingEventType.StakingWithdraw })
  public approval(@Payload() event: ILogEvent<IStakingWithdraw>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.withdraw(event, context);
  }
}
