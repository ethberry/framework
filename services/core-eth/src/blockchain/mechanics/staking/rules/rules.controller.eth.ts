import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import type {
  IStakingBalanceWithdrawEvent,
  IStakingRuleCreateEvent,
  IStakingDepositStartEvent,
  IStakingDepositFinishEvent,
  IStakingDepositReturnEvent,
  IStakingRuleUpdateEvent,
  IStakingDepositWithdrawEvent,
} from "@framework/types";
import { ContractType, StakingEventType } from "@framework/types";

import { StakingRulesServiceEth } from "./rules.service.eth";

@Controller()
export class StakingRulesControllerEth {
  constructor(private readonly stakingServiceEth: StakingRulesServiceEth) {}

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.RuleCreated })
  public ruleCreate(@Payload() event: ILogEvent<IStakingRuleCreateEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.ruleCreate(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.RuleUpdated })
  public ruleUpdate(@Payload() event: ILogEvent<IStakingRuleUpdateEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.ruleUpdate(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.DepositStart })
  public depositStart(@Payload() event: ILogEvent<IStakingDepositStartEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.depositStart(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.DepositWithdraw })
  public depositWithdraw(
    @Payload() event: ILogEvent<IStakingDepositWithdrawEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.stakingServiceEth.depositWithdraw(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.DepositReturn })
  public depositReturn(@Payload() event: ILogEvent<IStakingDepositReturnEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.depositReturn(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.DepositFinish })
  public depositFinish(@Payload() event: ILogEvent<IStakingDepositFinishEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.depositFinish(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.BalanceWithdraw })
  public balanceWithdraw(
    @Payload() event: ILogEvent<IStakingBalanceWithdrawEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.stakingServiceEth.balanceWithdraw(event, context);
  }
}
