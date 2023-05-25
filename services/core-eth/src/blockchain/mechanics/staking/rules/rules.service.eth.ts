import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";
import { emptyStateString } from "@gemunion/draft-js-utils";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  DurationUnit,
  IAssetDto,
  IErc1363TransferReceivedEvent,
  IStakingBalanceWithdrawEvent,
  IStakingCreateEvent,
  IStakingDepositEvent,
  IStakingFinishEvent,
  IStakingUpdateEvent,
  IStakingWithdrawEvent,
  StakingRuleStatus,
} from "@framework/types";

import { EventHistoryService } from "../../../event-history/event-history.service";
import { NotificatorService } from "../../../../game/notificator/notificator.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { StakingDepositService } from "../deposit/deposit.service";
import { StakingRulesService } from "./rules.service";

@Injectable()
export class StakingRulesServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly stakingRulesService: StakingRulesService,
    private readonly templateService: TemplateService,
    private readonly contractService: ContractService,
    private readonly stakingDepositService: StakingDepositService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async create(event: ILogEvent<IStakingCreateEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { rule, ruleId },
    } = event;
    const { address } = context;

    const [deposit, reward, _content, period, penalty, recurrent, _active] = rule;

    // DEPOSIT ARRAY
    const depositItem: IAssetDto = await this.stakingRulesService.createEmptyAsset();

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
    const rewardItem: IAssetDto = await this.stakingRulesService.createEmptyAsset();

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
      durationUnit: DurationUnit.DAY,
      penalty: ~~penalty,
      recurrent,
      stakingRuleStatus: StakingRuleStatus.NEW,
      externalId: ruleId,
      contractId: contractEntity.id,
    });

    this.notificatorService.stakingRuleCreated({
      externalId: ruleId,
      deposit: depositItem,
      reward: rewardItem,
      penalty: ~~penalty,
      recurrent,
    });
  }

  public async update(event: ILogEvent<IStakingUpdateEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { ruleId, active },
    } = event;

    const stakingEntity = await this.stakingRulesService.findOne({ externalId: ruleId });

    if (!stakingEntity) {
      this.loggerService.error("stakingRuleNotFound", ruleId, StakingRulesServiceEth.name);
      throw new NotFoundException("stakingRuleNotFound");
    }

    Object.assign(stakingEntity, {
      stakingRuleStatus: active ? StakingRuleStatus.ACTIVE : StakingRuleStatus.INACTIVE,
    });

    await stakingEntity.save();

    this.notificatorService.stakingRuleUpdated({
      externalId: ruleId,
      active,
    });
  }

  public async depositStart(event: ILogEvent<IStakingDepositEvent>, context: Log): Promise<void> {
    // emit StakingStart(stakeId, ruleId, _msgSender(), block.timestamp, tokenId);
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { stakingId, ruleId, owner, startTimestamp },
    } = event;

    const stakingRuleEntity = await this.stakingRulesService.findOne({ externalId: ruleId });

    if (!stakingRuleEntity) {
      this.loggerService.error("stakingRuleNotFound", ruleId, StakingRulesServiceEth.name);
      throw new NotFoundException("stakingRuleNotFound");
    }

    await this.stakingDepositService.create({
      account: owner.toLowerCase(),
      externalId: stakingId,
      startTimestamp: new Date(~~startTimestamp * 1000).toISOString(),
      stakingRuleId: stakingRuleEntity.id,
    });

    this.notificatorService.stakingDepositStart({
      account: owner.toLowerCase(),
      externalId: ~~stakingId,
      startTimestamp: new Date(~~startTimestamp * 1000).getDate(),
      stakingRuleId: stakingRuleEntity.id,
    });
  }

  public async depositWithdraw(event: ILogEvent<IStakingWithdrawEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }

  public async depositFinish(event: ILogEvent<IStakingFinishEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);

    const {
      args: { stakingId, owner, finishTimestamp, multiplier },
    } = event;

    this.notificatorService.stakingDepositFinish({
      account: owner.toLowerCase(),
      externalId: ~~stakingId,
      startTimestamp: new Date(~~finishTimestamp * 1000).getDate(),
      multiplier: ~~multiplier,
    });
  }

  public async withdrawBalance(event: ILogEvent<IStakingBalanceWithdrawEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }

  public async transferReceived(event: ILogEvent<IErc1363TransferReceivedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    // Balance will update by Erc20 controller
  }
}
