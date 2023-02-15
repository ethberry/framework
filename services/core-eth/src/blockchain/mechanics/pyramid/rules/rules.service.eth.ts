import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IPyramidCreateEvent, IPyramidUpdateEvent, PyramidRuleStatus } from "@framework/types";
import { PyramidRulesService } from "./rules.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { EventHistoryService } from "../../../event-history/event-history.service";

@Injectable()
export class PyramidRulesServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly pyramidRulesService: PyramidRulesService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly contractService: ContractService,
  ) {}

  public async create(event: ILogEvent<IPyramidCreateEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { ruleId, externalId },
    } = event;
    const { address } = context;

    const contractEntity = await this.contractService.findOne({
      address: address.toLowerCase(),
    });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const pyramidRuleEntity = await this.pyramidRulesService.findOne({
      id: ~~externalId,
      contractId: contractEntity.id,
    });

    if (!pyramidRuleEntity) {
      throw new NotFoundException("pyramidRuleNotFound");
    }

    Object.assign(pyramidRuleEntity, {
      externalId: ruleId,
      pyramidRuleStatus: PyramidRuleStatus.ACTIVE,
    });

    await pyramidRuleEntity.save();
  }

  public async update(event: ILogEvent<IPyramidUpdateEvent>, context: Log): Promise<void> {
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

    const pyramidRuleEntity = await this.pyramidRulesService.findOne({
      externalId: ruleId,
      contractId: contractEntity.id,
    });

    if (!pyramidRuleEntity) {
      throw new NotFoundException("pyramidRuleNotFound");
    }

    Object.assign(pyramidRuleEntity, {
      pyramidRuleStatus: active ? PyramidRuleStatus.ACTIVE : PyramidRuleStatus.INACTIVE,
    });

    await pyramidRuleEntity.save();
  }
}
