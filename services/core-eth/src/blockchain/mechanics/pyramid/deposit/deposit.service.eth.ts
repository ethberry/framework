import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log, ZeroAddress } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import {
  IFinalizedTokenEvent,
  IPyramidDepositEvent,
  IPyramidFinishEvent,
  IPyramidWithdrawEvent,
  IWithdrawTokenEvent,
  PyramidDepositStatus,
} from "@framework/types";
import { PyramidDepositService } from "./deposit.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { PyramidRulesService } from "../rules/rules.service";
import { PyramidDepositEntity } from "./deposit.entity";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { EventHistoryService } from "../../../event-history/event-history.service";

@Injectable()
export class PyramidDepositServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly pyramidDepositService: PyramidDepositService,
    private readonly pyramidRulesService: PyramidRulesService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly balanceService: BalanceService,
    private readonly tokenService: TokenService,
    private readonly contractService: ContractService,
  ) {}

  public async start(event: ILogEvent<IPyramidDepositEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
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
      startTimestamp: new Date(Number(startTimestamp) * 1000).toISOString(),
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
    await this.eventHistoryService.updateHistory(event, context);
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
    await this.eventHistoryService.updateHistory(event, context);
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

  public async finishToken(event: ILogEvent<IFinalizedTokenEvent | IPyramidFinishEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    // TODO cancel all stakes? (or all TOKEN depost\reward stakes)
  }

  public async withdrawToken(event: ILogEvent<IWithdrawTokenEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { token, amount },
    } = event;
    const { address } = context;

    if (token.toLowerCase() === ZeroAddress) {
      const tokenEntity = await this.tokenService.getToken("0", token.toLowerCase());

      if (!tokenEntity) {
        throw new NotFoundException("tokenNotFound");
      }

      await this.balanceService.decrement(tokenEntity.id, address.toLowerCase(), amount);
    }
  }
}
