import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";
import { emptyStateString } from "@gemunion/draft-js-utils";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  DurationUnit,
  IAssetDto,
  IStakingBalanceWithdrawEvent,
  IStakingCreateEvent,
  IStakingDepositEvent,
  IStakingFinishEvent,
  IStakingUpdateEvent,
  IStakingWithdrawEvent,
  StakingRuleStatus,
} from "@framework/types";
import { StakingRulesService } from "./rules.service";
import { StakingDepositService } from "../deposit/deposit.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class StakingRulesServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly stakingRulesService: StakingRulesService,
    private readonly tokenService: TokenService,
    private readonly templateService: TemplateService,
    private readonly contractService: ContractService,
    private readonly stakingDepositService: StakingDepositService,
    private readonly eventHistoryService: EventHistoryService,
  ) {}

  public async create(event: ILogEvent<IStakingCreateEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { rule, ruleId },
    } = event;
    const { address } = context;

    const [deposit, reward, _content, period, penalty, recurrent, _active] = rule;

    // DEPOSIT ARRAY
    const depositItem: IAssetDto = {
      components: [],
    };

    for (const dep of deposit) {
      const [_tokenType, _token, templateId, amount] = dep;
      const depositTemplate = await this.templateService.findOne(
        { id: ~~templateId },
        { relations: { contract: true } },
      );

      if (!depositTemplate) {
        throw new NotFoundException("depositTemplateNotFound");
      }

      depositItem.components.push({
        tokenType: depositTemplate.contract.contractType,
        contractId: depositTemplate.contract.id,
        templateId: depositTemplate.id,
        amount,
      });
    }

    // REWARD ARRAY
    const rewardItem: IAssetDto = {
      components: [],
    };

    for (const rew of reward) {
      const [_tokenType, _token, templateId, amount] = rew;

      const rewardTemplate = await this.templateService.findOne(
        { id: ~~templateId },
        { relations: { contract: true } },
      );

      if (!rewardTemplate) {
        throw new NotFoundException("rewardTemplateNotFound");
      }

      rewardItem.components.push({
        tokenType: rewardTemplate.contract.contractType,
        contractId: rewardTemplate.contract.id,
        templateId: rewardTemplate.id,
        amount,
      });
    }

    const contractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.stakingRulesService.create({
      title: "new STAKING rule",
      description: emptyStateString,
      deposit: depositItem,
      reward: rewardItem,
      durationAmount: ~~period,
      durationUnit: DurationUnit.DAY, // TODO select correct unit depends on period
      penalty: ~~penalty,
      recurrent,
      stakingRuleStatus: StakingRuleStatus.NEW,
      externalId: ruleId,
      contractId: contractEntity.id,
    });
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
    // emit StakingStart(stakeId, ruleId, _msgSender(), block.timestamp, tokenId);
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

  public async withdrawBalance(event: ILogEvent<IStakingBalanceWithdrawEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }
}
