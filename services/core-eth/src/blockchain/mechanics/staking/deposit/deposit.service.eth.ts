import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";

import { Log } from "ethers";
import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type {
  IStakingDepositFinishEvent,
  IStakingDepositReturnEvent,
  IStakingDepositStartEvent,
  IStakingDepositWithdrawEvent,
} from "@framework/types";

import { NotificatorService } from "../../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { StakingRulesService } from "../rules/rules.service";
import { StakingDepositService } from "./deposit.service";

@Injectable()
export class StakingDepositServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly stakingRulesService: StakingRulesService,
    private readonly stakingDepositService: StakingDepositService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async depositStart(event: ILogEvent<IStakingDepositStartEvent>, context: Log): Promise<void> {
    // emit StakingStart(stakeId, ruleId, _msgSender(), block.timestamp, tokenId);
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { stakingId, ruleId, owner, startTimestamp },
    } = event;
    const { address, transactionHash } = context;

    const stakingRuleEntity = await this.stakingRulesService.findOne({ externalId: ruleId });

    if (!stakingRuleEntity) {
      this.loggerService.error("stakingRuleNotFound", ruleId, StakingDepositServiceEth.name);
      throw new NotFoundException("stakingRuleNotFound");
    }

    const stakingDepositEntity = await this.stakingDepositService.create({
      account: owner.toLowerCase(),
      externalId: stakingId,
      startTimestamp: new Date(Number(startTimestamp) * 1000).toISOString(),
      stakingRuleId: stakingRuleEntity.id,
      stakingRule: stakingRuleEntity,
    });

    await this.notificatorService.stakingDepositStart({
      stakingDeposit: stakingDepositEntity,
      address,
      transactionHash,
    });
  }

  public async depositWithdraw(event: ILogEvent<IStakingDepositWithdrawEvent>, context: Log): Promise<void> {
    // penalty = staking.rule.amount - deposit.return.amount
    // save penalty to asset
    await this.eventHistoryService.updateHistory(event, context);
  }

  public async depositReturn(event: ILogEvent<IStakingDepositReturnEvent>, context: Log): Promise<void> {
    // penalty = most likely 0
    await this.eventHistoryService.updateHistory(event, context);
  }

  public async depositFinish(event: ILogEvent<IStakingDepositFinishEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);

    const {
      args: { stakingId },
    } = event;
    const { address, transactionHash } = context;

    const stakingDepositEntity = await this.stakingDepositService.findOne({
      externalId: stakingId,
    });

    if (!stakingDepositEntity) {
      throw new NotFoundException("stakingDepositNotFound");
    }

    await this.notificatorService.stakingDepositFinish({
      stakingDeposit: stakingDepositEntity,
      address,
      transactionHash,
    });
  }
}
