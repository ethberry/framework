import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  IStakingCreate,
  IStakingDeposit,
  IStakingFinish,
  IStakingUpdate,
  IStakingWithdraw,
  StakingEventType,
  StakingStatus,
  TStakingEventData,
} from "@framework/types";

import { ContractManagerService } from "../../../contract-manager/contract-manager.service";
import { StakingHistoryService } from "../history/history.service";
import { StakingRulesService } from "./rules.service";
import { StakingStakesService } from "../stakes/stakes.service";

@Injectable()
export class StakingRulesServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly stakingRulesService: StakingRulesService,
    private readonly stakingStakesService: StakingStakesService,
    private readonly historyService: StakingHistoryService,
    private readonly contractManagerService: ContractManagerService,
  ) {}

  public async create(event: ILogEvent<IStakingCreate>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
    const {
      args: { ruleId, externalId },
    } = event;

    const stakingEntity = await this.stakingRulesService.findOne({ id: ~~externalId });

    if (!stakingEntity) {
      throw new NotFoundException("stakingRuleNotFound");
    }

    Object.assign(stakingEntity, {
      externalId: ruleId,
      stakingStatus: StakingStatus.ACTIVE,
    });

    await stakingEntity.save();
  }

  public async update(event: ILogEvent<IStakingUpdate>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
    const {
      args: { ruleId, active },
    } = event;

    const stakingEntity = await this.stakingRulesService.findOne({ externalId: ruleId });

    if (!stakingEntity) {
      throw new NotFoundException("stakingRuleNotFound");
    }

    Object.assign(stakingEntity, {
      stakingStatus: active ? StakingStatus.ACTIVE : StakingStatus.INACTIVE,
    });

    await stakingEntity.save();
  }

  public async start(event: ILogEvent<IStakingDeposit>, context: Log): Promise<void> {
    // TODO fix it!    emit StakingStart(stakeId, ruleId, _msgSender(), block.timestamp, tokenId);
    await this.updateHistory(event, context);
    const {
      args: { stakingId, ruleId, owner, startTimestamp },
    } = event;

    const stakingRuleEntity = await this.stakingRulesService.findOne({ externalId: ruleId });

    if (!stakingRuleEntity) {
      throw new NotFoundException("stakingRuleNotFound");
    }

    await this.stakingStakesService.create({
      account: owner.toLowerCase(),
      externalId: stakingId,
      startTimestamp: new Date(~~startTimestamp * 1000).toISOString(),
      stakingRuleId: stakingRuleEntity.id,
    });
  }

  public async withdraw(event: ILogEvent<IStakingWithdraw>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async finish(event: ILogEvent<IStakingFinish>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TStakingEventData>, context: Log) {
    this.loggerService.log(
      JSON.stringify(
        Object.assign(
          { name: event.name, signature: event.signature, topic: event.topic, args: event.args },
          {
            address: context.address,
            transactionHash: context.transactionHash,
            blockNumber: context.blockNumber,
          },
        ),
        null,
        "\t",
      ),
      StakingRulesServiceEth.name,
    );

    const { name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.historyService.create({
      address,
      transactionHash,
      eventType: name as StakingEventType,
      eventData: event.args,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
