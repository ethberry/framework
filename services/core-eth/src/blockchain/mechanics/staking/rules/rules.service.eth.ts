import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

import { Log } from "ethers";

import { emptyStateString } from "@gemunion/draft-js-utils";
import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IAssetDto, IStakingRuleCreateEvent, IStakingRuleUpdateEvent } from "@framework/types";
import { DurationUnit, RmqProviderType, SignalEventType, StakingRuleStatus } from "@framework/types";
import { testChainId } from "@framework/constants";

import { NotificatorService } from "../../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { StakingRulesService } from "./rules.service";

@Injectable()
export class StakingRulesServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly configService: ConfigService,
    private readonly stakingRulesService: StakingRulesService,
    private readonly templateService: TemplateService,
    private readonly contractService: ContractService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async ruleCreate(event: ILogEvent<IStakingRuleCreateEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      name,
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

    const contractEntity = await this.contractService.findOne(
      { address: address.toLowerCase(), chainId },
      { relations: { merchant: true } },
    );

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

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: contractEntity.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async ruleUpdate(event: ILogEvent<IStakingRuleUpdateEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      name,
      args: { ruleId, active },
    } = event;
    const { address, transactionHash } = context;

    const stakingRuleEntity = await this.stakingRulesService.findOne(
      { externalId: ruleId },
      { relations: { contract: { merchant: true } } },
    );

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

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: stakingRuleEntity.contract.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }
}
