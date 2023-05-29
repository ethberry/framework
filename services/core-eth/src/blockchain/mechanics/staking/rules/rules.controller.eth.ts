import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  Erc1363EventType,
  IErc1363TransferReceivedEvent,
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
  public ruleCreate(@Payload() event: ILogEvent<IStakingCreateEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.ruleCreate(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.RuleUpdated })
  public update(@Payload() event: ILogEvent<IStakingUpdateEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.update(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.StakingStart })
  public depositStart(@Payload() event: ILogEvent<IStakingDepositEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.depositStart(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.StakingWithdraw })
  public depositWithdraw(@Payload() event: ILogEvent<IStakingWithdrawEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.depositWithdraw(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.ReturnDeposit })
  public depositReturn(@Payload() event: ILogEvent<IStakingReturnDepositEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.depositReturn(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.StakingFinish })
  public depositFinish(@Payload() event: ILogEvent<IStakingFinishEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.depositFinish(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.WithdrawBalance })
  public withdraw(@Payload() event: ILogEvent<IStakingBalanceWithdrawEvent>, @Ctx() context: Log): Promise<void> {
    return this.stakingServiceEth.withdraw(event, context);
  }

  @EventPattern({ contractType: ContractType.STAKING, eventName: Erc1363EventType.TransferReceived })
  public transferReceived(
    @Payload() event: ILogEvent<IErc1363TransferReceivedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.stakingServiceEth.transferReceived(event, context);
  }
}
