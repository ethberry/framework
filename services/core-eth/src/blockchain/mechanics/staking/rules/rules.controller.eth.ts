import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  IStakingCreate,
  IStakingDeposit,
  IStakingFinish,
  IStakingUpdate,
  IStakingWithdraw,
  StakingEventType,
} from "@framework/types";

import { StakingRulesServiceEth } from "./rules.service.eth";

@Controller()
export class StakingRulesControllerEth {
  constructor(private readonly stakingServiceEth: StakingRulesServiceEth) {}

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.RuleCreated })
  public create(@Payload() event: ILogEvent<IStakingCreate>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.create(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.RuleUpdated })
  public update(@Payload() event: ILogEvent<IStakingUpdate>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.update(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.StakingStart })
  public start(@Payload() event: ILogEvent<IStakingDeposit>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.start(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.StakingWithdraw })
  public withdraw(@Payload() event: ILogEvent<IStakingWithdraw>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.withdraw(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.StakingFinish })
  public finish(@Payload() event: ILogEvent<IStakingFinish>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.finish(event, context);
  }
}
