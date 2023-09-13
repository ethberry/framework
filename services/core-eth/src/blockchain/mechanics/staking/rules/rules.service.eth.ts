import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Log } from "ethers";

import { emptyStateString } from "@gemunion/draft-js-utils";
import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type {
  IAssetDto,
  IErc1363TransferReceivedEvent,
  IStakingBalanceWithdrawEvent,
  IStakingDepositFinishEvent,
  IStakingDepositReturnEvent,
  IStakingDepositStartEvent,
  IStakingDepositWithdrawEvent,
  IStakingRuleCreateEvent,
  IStakingRuleUpdateEvent,
} from "@framework/types";
import { DurationUnit, StakingRuleStatus } from "@framework/types";
import { testChainId } from "@framework/constants";

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
    private readonly configService: ConfigService,
    private readonly stakingRulesService: StakingRulesService,
    private readonly templateService: TemplateService,
    private readonly contractService: ContractService,
    private readonly stakingDepositService: StakingDepositService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async ruleCreate(event: ILogEvent<IStakingRuleCreateEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { rule, ruleId },
    } = event;
    const { address, transactionHash } = context;

    const { deposit, reward, period, penalty, maxStake, recurrent, active } = rule;

    // DEPOSIT ARRAY
    const depositItem: IAssetDto = await this.stakingRulesService.createEmptyAsset();

    for (const dep of deposit) {
      const { tokenId, amount } = dep;
      const depositTemplate = await this.templateService.findOne(
        { id: Number(tokenId) },
        { relations: { contract: true } },
      );

      if (!depositTemplate) {
        throw new NotFoundException("depositTemplateNotFound");
      }

      depositItem.components.push({
        tokenType: depositTemplate.contract.contractType!,
        contractId: depositTemplate.contract.id,
        templateId: depositTemplate.id,
        amount,
      });
    }

    // REWARD ARRAY
    const rewardItem: IAssetDto = await this.stakingRulesService.createEmptyAsset();

    for (const rew of reward) {
      const { tokenId, amount } = rew;

      const rewardTemplate = await this.templateService.findOne(
        { id: Number(tokenId) },
        { relations: { contract: true } },
      );

      if (!rewardTemplate) {
        throw new NotFoundException("rewardTemplateNotFound");
      }

      rewardItem.components.push({
        tokenType: rewardTemplate.contract.contractType!,
        contractId: rewardTemplate.contract.id,
        templateId: rewardTemplate.id,
        amount,
      });
    }

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const contractEntity = await this.contractService.findOne({ address: address.toLowerCase(), chainId });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    // new ACTIVE rule is NEW to hide it from display in market
    const stakingRuleStatus = active === true ? StakingRuleStatus.NEW : StakingRuleStatus.INACTIVE;
    const stakingRuleEntity = await this.stakingRulesService.create({
      title: "new STAKING rule",
      description: emptyStateString,
      deposit: depositItem,
      reward: rewardItem,
      durationAmount: Number(period),
      durationUnit: DurationUnit.DAY,
      penalty: Number(penalty),
      maxStake: Number(maxStake),
      recurrent,
      stakingRuleStatus,
      externalId: ruleId,
      contractId: contractEntity.id,
      contract: contractEntity,
    });

    await this.notificatorService.stakingRuleCreated({
      stakingRule: stakingRuleEntity,
      address,
      transactionHash,
    });
  }

  public async ruleUpdate(event: ILogEvent<IStakingRuleUpdateEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { ruleId, active },
    } = event;
    const { address, transactionHash } = context;

    const stakingRuleEntity = await this.stakingRulesService.findOne({ externalId: ruleId });

    if (!stakingRuleEntity) {
      this.loggerService.error("stakingRuleNotFound", ruleId, StakingRulesServiceEth.name);
      throw new NotFoundException("stakingRuleNotFound");
    }

    Object.assign(stakingRuleEntity, {
      stakingRuleStatus: active ? StakingRuleStatus.ACTIVE : StakingRuleStatus.INACTIVE,
    });

    await stakingRuleEntity.save();

    await this.notificatorService.stakingRuleUpdated({
      stakingRule: stakingRuleEntity,
      address,
      transactionHash,
    });
  }

  public async depositStart(event: ILogEvent<IStakingDepositStartEvent>, context: Log): Promise<void> {
    // emit StakingStart(stakeId, ruleId, _msgSender(), block.timestamp, tokenId);
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { stakingId, ruleId, owner, startTimestamp },
    } = event;
    const { address, transactionHash } = context;

    const stakingRuleEntity = await this.stakingRulesService.findOne({ externalId: ruleId });

    if (!stakingRuleEntity) {
      this.loggerService.error("stakingRuleNotFound", ruleId, StakingRulesServiceEth.name);
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
    await this.eventHistoryService.updateHistory(event, context);
  }

  public async depositReturn(event: ILogEvent<IStakingDepositReturnEvent>, context: Log): Promise<void> {
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

  public async balanceWithdraw(event: ILogEvent<IStakingBalanceWithdrawEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }

  public async transferReceived(event: ILogEvent<IErc1363TransferReceivedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    // Balance will update by Erc20 controller
  }
}
