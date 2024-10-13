import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";

import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";

import type { IAssetDto, IPonziCreateEvent, IPonziUpdateEvent } from "@framework/types";
import { PonziRuleStatus, RmqProviderType, SignalEventType } from "@framework/types";
import { testChainId } from "@framework/constants";

import { PonziRulesService } from "./rules.service";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { EventHistoryService } from "../../../../event-history/event-history.service";
import { TemplateService } from "../../../../hierarchy/template/template.service";
import { NotificatorService } from "../../../../../game/notificator/notificator.service";
import { getDurationUnit } from "../../../../../common/utils/time";

@Injectable()
export class PonziRulesServiceEth {
  constructor(
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly ponziRulesService: PonziRulesService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly contractService: ContractService,
    private readonly templateService: TemplateService,
    private readonly configService: ConfigService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async create(event: ILogEvent<IPonziCreateEvent>, context: Log): Promise<void> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    await this.eventHistoryService.updateHistory(event, context);
    const {
      name,
      args: { rule, ruleId },
    } = event;
    const { deposit, reward, terms } = rule;
    const { period, maxCycles, penalty } = terms;
    const { transactionHash, address } = context;

    const { active } = rule;

    const contractEntity = await this.contractService.findOne(
      {
        address: address.toLowerCase(),
      },
      { relations: { merchant: true } },
    );

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    // DEPOSIT ARRAY
    const depositItem: IAssetDto = { components: [] };

    const { tokenId, token, amount } = deposit;
    if (tokenId !== 0n) {
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

    // REWARD ARRAY
    const rewardItem: IAssetDto = { components: [] };
    // const { tokenId, token, amount } = reward;
    if (reward.tokenId !== 0n) {
      const rewardTemplate = await this.templateService.findOne(
        { id: Number(reward.tokenId) },
        { relations: { contract: true } },
      );

      if (!rewardTemplate) {
        throw new NotFoundException("rewardTemplateNotFound");
      }

      rewardItem.components.push({
        tokenType: rewardTemplate.contract.contractType!,
        contractId: rewardTemplate.contract.id,
        templateId: rewardTemplate.id,
        amount: reward.amount,
      });
    } else {
      const contractEntity = await this.contractService.findOne({ address: reward.token.toLowerCase(), chainId });

      if (!contractEntity) {
        throw new NotFoundException("depositContractNotFound");
      }

      rewardItem.components.push({
        tokenType: contractEntity.contractType!,
        contractId: contractEntity.id,
        templateId: null,
        amount: reward.amount,
      });
    }

    // new ACTIVE rule is NEW to hide it from display in market
    const ponziRuleStatus = active === true ? PonziRuleStatus.NEW : PonziRuleStatus.INACTIVE;
    const ponziRuleEntity = await this.ponziRulesService.create({
      title: "new STAKING rule",
      deposit: depositItem,
      reward: rewardItem,
      durationAmount: Number(period),
      durationUnit: getDurationUnit(Number(period)),
      penalty: Number(penalty),
      maxCycles: Number(maxCycles),
      ponziRuleStatus,
      externalId: ruleId,
      contractId: contractEntity.id,
      contract: contractEntity,
    });

    await this.notificatorService.ponziRuleCreated({
      ponziRule: ponziRuleEntity,
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

  public async update(event: ILogEvent<IPonziUpdateEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      name,
      args: { ruleId, active },
    } = event;
    const { transactionHash, address } = context;

    const contractEntity = await this.contractService.findOne(
      {
        address: address.toLowerCase(),
      },
      { relations: { merchant: true } },
    );

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const ponziRuleEntity = await this.ponziRulesService.findOne({
      externalId: ruleId,
      contractId: contractEntity.id,
    });

    if (!ponziRuleEntity) {
      throw new NotFoundException("ponziRuleNotFound");
    }

    Object.assign(ponziRuleEntity, {
      ponziRuleStatus: active ? PonziRuleStatus.ACTIVE : PonziRuleStatus.INACTIVE,
    });

    await ponziRuleEntity.save();

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: contractEntity.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }
}
