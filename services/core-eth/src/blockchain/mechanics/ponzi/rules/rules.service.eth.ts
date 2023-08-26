import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import { IPonziCreateEvent, IPonziUpdateEvent, PonziRuleStatus } from "@framework/types";
import { PonziRulesService } from "./rules.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { EventHistoryService } from "../../../event-history/event-history.service";

@Injectable()
export class PonziRulesServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly ponziRulesService: PonziRulesService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly contractService: ContractService,
  ) {}

  public async create(event: ILogEvent<IPonziCreateEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { rule, ruleId, externalId },
    } = event;
    const { address } = context;

    const { active } = rule;

    const contractEntity = await this.contractService.findOne({
      address: address.toLowerCase(),
    });

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
  }

  public async update(event: ILogEvent<IPonziUpdateEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { ruleId, active },
    } = event;
    const { address } = context;

    const contractEntity = await this.contractService.findOne({
      address: address.toLowerCase(),
    });

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
  }
}
