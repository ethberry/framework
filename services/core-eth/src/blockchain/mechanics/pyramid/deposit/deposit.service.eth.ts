import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  IFinalizedTokenEvent,
  IPyramidDepositEvent,
  IPyramidFinishEvent,
  IPyramidWithdrawEvent,
  PyramidDepositStatus,
  PyramidEventType,
  TPyramidEventData,
} from "@framework/types";

import { PyramidHistoryService } from "../history/history.service";
import { PyramidDepositService } from "./deposit.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { PyramidRulesService } from "../rules/rules.service";
import { PyramidDepositEntity } from "./deposit.entity";

@Injectable()
export class PyramidDepositServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly pyramidDepositService: PyramidDepositService,
    private readonly pyramidRulesService: PyramidRulesService,
    private readonly historyService: PyramidHistoryService,
    private readonly contractService: ContractService,
  ) {}

  public async start(event: ILogEvent<IPyramidDepositEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
    const {
      args: { stakingId, ruleId, owner, startTimestamp },
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

    await this.pyramidDepositService.create({
      account: owner.toLowerCase(),
      externalId: stakingId,
      startTimestamp: new Date(~~startTimestamp * 1000).toISOString(),
      pyramidRuleId: pyramidRuleEntity.id,
    });
  }

  public async findStake(externalId: string, address: string): Promise<PyramidDepositEntity> {
    const contractEntity = await this.contractService.findOne({
      address: address.toLowerCase(),
    });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const stakeEntity = await this.pyramidDepositService.findStake(externalId, contractEntity.id);
    if (!stakeEntity) {
      throw new NotFoundException("stakeNotFound");
    }

    return stakeEntity;
  }

  public async withdraw(event: ILogEvent<IPyramidWithdrawEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
    const {
      args: { stakingId },
    } = event;
    const { address } = context;

    const stakeEntity = await this.findStake(stakingId, address);

    Object.assign(stakeEntity, {
      stakingDepositStatus: PyramidDepositStatus.CANCELED, // TODO status FINISH instead ???
    });

    await stakeEntity.save();
  }

  public async finish(event: ILogEvent<IPyramidFinishEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
    const {
      args: { stakingId },
    } = event;
    const { address } = context;

    const stakeEntity = await this.findStake(stakingId, address);

    Object.assign(stakeEntity, {
      stakingDepositStatus: PyramidDepositStatus.COMPLETE,
    });

    await stakeEntity.save();
  }

  public async finishToken(event: ILogEvent<IPyramidFinishEvent | IFinalizedTokenEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
    // TODO cancel all stakes (or all TOKEN depost\reward stakes)
  }

  private async updateHistory(event: ILogEvent<TPyramidEventData>, context: Log) {
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
      PyramidDepositServiceEth.name,
    );

    const { name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.historyService.create({
      address,
      transactionHash,
      eventType: name as PyramidEventType,
      eventData: event.args,
    });

    await this.contractService.updateLastBlockByAddr(address.toLowerCase(), parseInt(blockNumber.toString(), 16));
  }
}
