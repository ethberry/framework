import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IStakingBalanceWithdrawEvent, IStakingRuleCreateEvent, IStakingRuleUpdateEvent } from "@framework/types";
import { ContractType, StakingEventType } from "@framework/types";

import { StakingRulesServiceEth } from "./rules.service.eth";

@Controller()
export class StakingRulesControllerEth {
  constructor(private readonly stakingRulesServiceEth: StakingRulesServiceEth) {}

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.RuleCreated })
  public ruleCreate(@Payload() event: ILogEvent<IStakingRuleCreateEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingRulesServiceEth.ruleCreate(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.RuleUpdated })
  public ruleUpdate(@Payload() event: ILogEvent<IStakingRuleUpdateEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingRulesServiceEth.ruleUpdate(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.BalanceWithdraw })
  public balanceWithdraw(
    @Payload() event: ILogEvent<IStakingBalanceWithdrawEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.stakingRulesServiceEth.balanceWithdraw(event, context);
  }
}
