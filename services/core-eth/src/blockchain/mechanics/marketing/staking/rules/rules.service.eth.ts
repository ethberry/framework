import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

import { Log } from "ethers";

import { emptyStateString } from "@gemunion/draft-js-utils";
import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IAssetDto, IStakingRuleCreateEvent, IStakingRuleUpdateEvent } from "@framework/types";
import { RmqProviderType, SignalEventType, StakingRuleStatus } from "@framework/types";
import { testChainId } from "@framework/constants";

import { NotificatorService } from "../../../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../../../event-history/event-history.service";
import { TemplateService } from "../../../../hierarchy/template/template.service";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { getDurationUnit } from "../../../../../common/utils/time";
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
    const {
      name,
      args: { rule, ruleId },
    } = event;
    const { address, transactionHash } = context;

    const { deposit, reward, terms, active } = rule;
    const { recurrent, advance, period, penalty, maxStake } = terms;

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const contractEntity = await this.contractService.findOne(
      { address: address.toLowerCase(), chainId },
      { relations: { merchant: true } },
    );

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, void 0, contractEntity.id);

    // DEPOSIT ARRAY
    const depositItem: IAssetDto = { components: [] };

    for (const dep of deposit) {
      const { tokenId, token, amount } = dep;
      if (tokenId !== "0") {
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
      } else {
        const contractEntity = await this.contractService.findOne({ address: token.toLowerCase(), chainId });

        if (!contractEntity) {
          throw new NotFoundException("depositContractNotFound");
        }

        depositItem.components.push({
          tokenType: contractEntity.contractType!,
          contractId: contractEntity.id,
          templateId: null,
          amount,
        });
      }
    }

    // REWARD ARRAY
    const rewardItem: IAssetDto = { components: [] };

    for (const rew of reward) {
      const { tokenId, token, amount } = rew;

      if (tokenId !== "0") {
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
      } else {
        const contractEntity = await this.contractService.findOne({ address: token.toLowerCase(), chainId });

        if (!contractEntity) {
          throw new NotFoundException("depositContractNotFound");
        }

        rewardItem.components.push({
          tokenType: contractEntity.contractType!,
          contractId: contractEntity.id,
          templateId: null,
          amount,
        });
      }
    }

    // new ACTIVE rule is NEW to hide it from display in market
    const stakingRuleStatus = active === true ? StakingRuleStatus.NEW : StakingRuleStatus.INACTIVE;
    const stakingRuleEntity = await this.stakingRulesService.create({
      title: "new STAKING rule", // TODO create new rule title based on rule's item\reward\period etc..?
      description: emptyStateString,
      deposit: depositItem,
      reward: rewardItem,
      durationAmount: Number(period),
      durationUnit: getDurationUnit(Number(period)),
      penalty: Number(penalty),
      maxStake: Number(maxStake),
      recurrent,
      advance,
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
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const contractEntity = await this.contractService.findOne({ address: address.toLowerCase(), chainId });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const stakingRuleEntity = await this.stakingRulesService.findOne(
      { externalId: ruleId, contractId: contractEntity.id },
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
