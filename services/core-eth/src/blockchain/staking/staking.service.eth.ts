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

import { ContractManagerService } from "../contract-manager/contract-manager.service";
import { StakingHistoryService } from "./staking-history/staking-history.service";
import { StakingService } from "./staking.service";
import { StakesService } from "./stakes/stakes.service";

@Injectable()
export class StakingServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly stakingService: StakingService,
    private readonly stakesService: StakesService,
    private readonly historyService: StakingHistoryService,
    private readonly contractManagerService: ContractManagerService,
  ) {}

  public async create(event: ILogEvent<IStakingCreate>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
    const {
      args: { ruleId, externalId },
    } = event;

    const stakingEntity = await this.stakingService.findOne({ id: ~~externalId });

    if (!stakingEntity) {
      throw new NotFoundException("stakingRuleNotFound");
    }

    Object.assign(stakingEntity, {
      ruleId,
      stakingStatus: StakingStatus.ACTIVE,
    });

    await stakingEntity.save();
  }

  public async update(event: ILogEvent<IStakingUpdate>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
    const {
      args: { ruleId, active },
    } = event;

    const stakingEntity = await this.stakingService.findOne({ ruleId });

    if (!stakingEntity) {
      throw new NotFoundException("stakingRuleNotFound");
    }

    Object.assign(stakingEntity, {
      stakingStatus: active ? StakingStatus.ACTIVE : StakingStatus.INACTIVE,
    });

    await stakingEntity.save();
  }

  public async start(event: ILogEvent<IStakingDeposit>, context: Log): Promise<void> {
    // await this.updateHistory(event, context);
    const {
      args: { stakingId, ruleId, owner, startTimestamp },
    } = event;

    // const stakingEntity = await this.stakingService.findOne({ ruleId });
    //
    // if (!stakingEntity) {
    //   throw new NotFoundException("stakingRuleNotFound");
    // }
    // console.log("args", owner, stakingId, startTimestamp, stakingEntity.id);
    console.log("args", owner, stakingId, startTimestamp);
    // await this.stakesService.create({
    //   owner,
    //   stakeId: stakingId,
    //   startTimestamp: new Date(~~startTimestamp * 1000).toISOString(),
    //   stakingRuleId: stakingEntity.id,
    // });
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
      StakingServiceEth.name,
    );

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.historyService.create({
      address,
      transactionHash,
      eventType: name as StakingEventType,
      // eventData: args,
      eventData: {},
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
