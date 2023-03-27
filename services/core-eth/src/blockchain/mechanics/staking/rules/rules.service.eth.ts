import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";
import { emptyStateString } from "@gemunion/draft-js-utils";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  IStakingCreateEvent,
  IStakingDepositEvent,
  IStakingFinishEvent,
  IStakingUpdateEvent,
  IStakingWithdrawEvent,
  StakingRuleStatus,
  DurationUnit,
  IAssetDto,
} from "@framework/types";
import { StakingRulesService } from "./rules.service";
import { StakingDepositService } from "../deposit/deposit.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { TokenService } from "../../../hierarchy/token/token.service";

@Injectable()
export class StakingRulesServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly stakingRulesService: StakingRulesService,
    private readonly tokenService: TokenService,
    private readonly stakingDepositService: StakingDepositService,
    private readonly eventHistoryService: EventHistoryService,
  ) {}

  public async create(event: ILogEvent<IStakingCreateEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { rule, ruleId },
    } = event;

    const { deposit, reward, period, penalty, recurrent } = rule;

    // DEPOSIT ARRAY
    const depositItem: IAssetDto = {
      components: [],
    };

    for (const dep of deposit) {
      const depositToken = await this.tokenService.getToken(dep.tokenId, dep.address.toLowerCase());

      if (!depositToken) {
        throw new NotFoundException("depositTokenNotFound");
      }

      depositItem.components.push({
        tokenType: depositToken.template.contract.contractType,
        contractId: depositToken.template.contract.id,
        templateId: depositToken.templateId,
        amount: dep.amount,
      });
    }

    // REWARD ARRAY
    const rewardItem: IAssetDto = {
      components: [],
    };

    for (const rew of reward) {
      const rewardToken = await this.tokenService.getToken(rew.tokenId, rew.address.toLowerCase());

      if (!rewardToken) {
        throw new NotFoundException("rewardTokenNotFound");
      }

      rewardItem.components.push({
        tokenType: rewardToken.template.contract.contractType,
        contractId: rewardToken.template.contract.id,
        templateId: rewardToken.templateId,
        amount: rew.amount,
      });
    }

    const stakingEntity = await this.stakingRulesService.create({
      title: "new STAKING rule",
      description: emptyStateString,
      deposit: depositItem,
      reward: rewardItem,
      durationAmount: Math.floor(~~period / (24 * 3600)),
      durationUnit: DurationUnit.DAY,
      penalty: ~~penalty,
      recurrent,
    });

    if (!stakingEntity) {
      throw new NotFoundException("stakingRuleNotCreated");
    }

    Object.assign(stakingEntity, {
      externalId: ruleId,
      stakingRuleStatus: StakingRuleStatus.ACTIVE,
    });

    await stakingEntity.save();
  }

  public async update(event: ILogEvent<IStakingUpdateEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { ruleId, active },
    } = event;

    const stakingEntity = await this.stakingRulesService.findOne({ externalId: ruleId });

    if (!stakingEntity) {
      throw new NotFoundException("stakingRuleNotFound");
    }

    Object.assign(stakingEntity, {
      stakingRuleStatus: active ? StakingRuleStatus.ACTIVE : StakingRuleStatus.INACTIVE,
    });

    await stakingEntity.save();
  }

  public async start(event: ILogEvent<IStakingDepositEvent>, context: Log): Promise<void> {
    // TODO fix it!    emit StakingStart(stakeId, ruleId, _msgSender(), block.timestamp, tokenId);
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { stakingId, ruleId, owner, startTimestamp },
    } = event;

    const stakingRuleEntity = await this.stakingRulesService.findOne({ externalId: ruleId });

    if (!stakingRuleEntity) {
      throw new NotFoundException("stakingRuleNotFound");
    }

    await this.stakingDepositService.create({
      account: owner.toLowerCase(),
      externalId: stakingId,
      startTimestamp: new Date(~~startTimestamp * 1000).toISOString(),
      stakingRuleId: stakingRuleEntity.id,
    });
  }

  public async withdraw(event: ILogEvent<IStakingWithdrawEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }

  public async finish(event: ILogEvent<IStakingFinishEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }
}
