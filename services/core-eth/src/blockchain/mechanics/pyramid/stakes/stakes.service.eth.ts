import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  IFinalizedToken,
  IPyramidDeposit,
  IPyramidFinish,
  IPyramidWithdraw,
  PyramidEventType,
  PyramidStakeStatus,
  TPyramidEventData,
} from "@framework/types";

import { PyramidHistoryService } from "../history/history.service";
import { PyramidStakesService } from "./stakes.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { PyramidRulesService } from "../rules/rules.service";
import { PyramidStakesEntity } from "./stakes.entity";

@Injectable()
export class PyramidStakesServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly pyramidStakesService: PyramidStakesService,
    private readonly pyramidRulesService: PyramidRulesService,
    private readonly historyService: PyramidHistoryService,
    private readonly contractService: ContractService,
  ) {}

  public async start(event: ILogEvent<IPyramidDeposit>, context: Log): Promise<void> {
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

    await this.pyramidStakesService.create({
      account: owner.toLowerCase(),
      externalId: stakingId,
      startTimestamp: new Date(~~startTimestamp * 1000).toISOString(),
      pyramidRuleId: pyramidRuleEntity.id,
    });
  }

  public async findStake(externalId: string, address: string): Promise<PyramidStakesEntity> {
    const contractEntity = await this.contractService.findOne({
      address: address.toLowerCase(),
    });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const stakeEntity = await this.pyramidStakesService.findStake(externalId, contractEntity.id);
    if (!stakeEntity) {
      throw new NotFoundException("stakeNotFound");
    }
    return stakeEntity;
  }

  public async withdraw(event: ILogEvent<IPyramidWithdraw>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
    const {
      args: { stakingId },
    } = event;
    const { address } = context;

    const stakeEntity = await this.findStake(stakingId, address);

    Object.assign(stakeEntity, {
      stakeStatus: PyramidStakeStatus.CANCELED, // TODO status FINISH instead ???
    });

    await stakeEntity.save();
  }

  public async finish(event: ILogEvent<IPyramidFinish>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
    const {
      args: { stakingId },
    } = event;
    const { address } = context;

    const stakeEntity = await this.findStake(stakingId, address);

    Object.assign(stakeEntity, {
      stakeStatus: PyramidStakeStatus.COMPLETE,
    });

    await stakeEntity.save();
  }

  public async finishToken(event: ILogEvent<IPyramidFinish | IFinalizedToken>, context: Log): Promise<void> {
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
      PyramidStakesServiceEth.name,
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
