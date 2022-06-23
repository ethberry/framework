import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  IStakingRuleDeposit,
  IStakingRuleFinish,
  IStakingRuleCreate,
  IStakingRuleUpdate,
  IStakingRuleWithdraw,
  StakingEventType,
} from "@framework/types";

import { StakingServiceEth } from "./staking.service.eth";

@Controller()
export class StakingControllerEth {
  constructor(private readonly stakingServiceEth: StakingServiceEth) {}

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.RuleCreated })
  public create(@Payload() event: ILogEvent<IStakingRuleCreate>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.create(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.RuleUpdated })
  public update(@Payload() event: ILogEvent<IStakingRuleUpdate>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.update(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.StakingStart })
  public start(@Payload() event: ILogEvent<IStakingRuleDeposit>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.start(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.StakingWithdraw })
  public withdraw(@Payload() event: ILogEvent<IStakingRuleWithdraw>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.withdraw(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.StakingFinish })
  public finish(@Payload() event: ILogEvent<IStakingRuleFinish>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.finish(event, context);
  }
}
