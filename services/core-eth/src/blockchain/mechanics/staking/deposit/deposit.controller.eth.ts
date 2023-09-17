import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type {
  IStakingDepositFinishEvent,
  IStakingDepositReturnEvent,
  IStakingDepositStartEvent,
  IStakingDepositWithdrawEvent,
} from "@framework/types";
import { ContractType, StakingEventType } from "@framework/types";

import { StakingDepositServiceEth } from "./deposit.service.eth";

@Controller()
export class StakingDepositControllerEth {
  constructor(private readonly stakingDepositServiceEth: StakingDepositServiceEth) {}

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.DepositStart })
  public depositStart(@Payload() event: ILogEvent<IStakingDepositStartEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingDepositServiceEth.depositStart(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.DepositWithdraw })
  public depositWithdraw(
    @Payload() event: ILogEvent<IStakingDepositWithdrawEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.stakingDepositServiceEth.depositWithdraw(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.DepositReturn })
  public depositReturn(@Payload() event: ILogEvent<IStakingDepositReturnEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingDepositServiceEth.depositReturn(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.DepositFinish })
  public depositFinish(@Payload() event: ILogEvent<IStakingDepositFinishEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingDepositServiceEth.depositFinish(event, context);
  }
}
