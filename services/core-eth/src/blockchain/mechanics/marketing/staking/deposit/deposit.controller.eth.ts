import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IStakingDepositFinishEvent,
  IStakingDepositReturnEvent,
  IStakingDepositStartEvent,
  IStakingDepositWithdrawEvent,
  IStakingPenaltyEvent,
} from "@framework/types";
import { StakingEventType } from "@framework/types";

import { StakingDepositServiceEth } from "./deposit.service.eth";
import { ContractType } from "../../../../../utils/contract-type";

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

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.DepositPenalty })
  public depositPenalty(@Payload() event: ILogEvent<IStakingPenaltyEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingDepositServiceEth.depositPenalty(event, context);
  }
}
