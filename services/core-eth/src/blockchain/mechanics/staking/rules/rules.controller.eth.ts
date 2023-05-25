import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  IStakingBalanceWithdrawEvent,
  IStakingCreateEvent,
  IStakingDepositEvent,
  IStakingFinishEvent,
  IStakingReturnDepositEvent,
  IStakingUpdateEvent,
  IStakingWithdrawEvent,
  StakingEventType,
} from "@framework/types";

import { StakingRulesServiceEth } from "./rules.service.eth";

@Controller()
export class StakingRulesControllerEth {
  constructor(private readonly stakingServiceEth: StakingRulesServiceEth) {}

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.RuleCreated })
  public create(@Payload() event: ILogEvent<IStakingCreateEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.create(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.RuleUpdated })
  public update(@Payload() event: ILogEvent<IStakingUpdateEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.update(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.StakingStart })
  public start(@Payload() event: ILogEvent<IStakingDepositEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.start(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.StakingWithdraw })
  public withdraw(@Payload() event: ILogEvent<IStakingWithdrawEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.withdraw(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.ReturnDeposit })
  public return(@Payload() event: ILogEvent<IStakingReturnDepositEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.return(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.WithdrawBalance })
  public withdrawBalance(
    @Payload() event: ILogEvent<IStakingBalanceWithdrawEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.stakingServiceEth.withdrawBalance(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.StakingFinish })
  public finish(@Payload() event: ILogEvent<IStakingFinishEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.finish(event, context);
  }
}
