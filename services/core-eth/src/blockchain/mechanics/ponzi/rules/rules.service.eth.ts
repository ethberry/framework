import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IPonziCreateEvent, IPonziUpdateEvent } from "@framework/types";
import { PonziRuleStatus, RmqProviderType, SignalEventType } from "@framework/types";
import { PonziRulesService } from "./rules.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { EventHistoryService } from "../../../event-history/event-history.service";

@Injectable()
export class PonziRulesServiceEth {
  constructor(
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly ponziRulesService: PonziRulesService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly contractService: ContractService,
  ) {}

  public async create(event: ILogEvent<IPonziCreateEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      name,
      args: { rule, ruleId, externalId },
    } = event;
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

    const ponziRuleEntity = await this.ponziRulesService.findOne({
      id: Number(externalId),
      contractId: contractEntity.id,
    });

    if (!ponziRuleEntity) {
      throw new NotFoundException("ponziRuleNotFound");
    }

    Object.assign(ponziRuleEntity, {
      externalId: ruleId,
      ponziRuleStatus: active === true ? PonziRuleStatus.NEW : PonziRuleStatus.INACTIVE,
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
