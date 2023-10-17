import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { Log, ZeroAddress } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type {
  IFinalizedTokenEvent,
  IPonziDepositEvent,
  IPonziFinishEvent,
  IPonziWithdrawEvent,
  IWithdrawTokenEvent,
} from "@framework/types";
import { PonziDepositStatus, RmqProviderType, SignalEventType } from "@framework/types";
import { PonziDepositService } from "./deposit.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { PonziRulesService } from "../rules/rules.service";
import { PonziDepositEntity } from "./deposit.entity";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { EventHistoryService } from "../../../event-history/event-history.service";

@Injectable()
export class PonziDepositServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly ponziDepositService: PonziDepositService,
    private readonly ponziRulesService: PonziRulesService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly balanceService: BalanceService,
    private readonly tokenService: TokenService,
    private readonly contractService: ContractService,
  ) {}

  public async start(event: ILogEvent<IPonziDepositEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      name,
      args: { stakingId, ruleId, owner, startTimestamp },
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

    await this.ponziDepositService.create({
      account: owner.toLowerCase(),
      externalId: stakingId,
      startTimestamp: new Date(Number(startTimestamp) * 1000).toISOString(),
      ponziRuleId: ponziRuleEntity.id,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: contractEntity.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async findStake(externalId: string, address: string): Promise<PonziDepositEntity> {
    const contractEntity = await this.contractService.findOne({
      address: address.toLowerCase(),
    });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const stakeEntity = await this.ponziDepositService.findStake(externalId, contractEntity.id);
    if (!stakeEntity) {
      throw new NotFoundException("stakeNotFound");
    }

    return stakeEntity;
  }

  public async withdraw(event: ILogEvent<IPonziWithdrawEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      name,
      args: { stakingId },
    } = event;
    const { transactionHash, address } = context;

    const stakeEntity = await this.findStake(stakingId, address);

    Object.assign(stakeEntity, {
      stakingDepositStatus: PonziDepositStatus.CANCELED, // TODO status FINISH instead ???
    });

    await stakeEntity.save();

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: stakeEntity.account,
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async finish(event: ILogEvent<IPonziFinishEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      name,
      args: { stakingId },
    } = event;
    const { address, transactionHash } = context;

    const stakeEntity = await this.findStake(stakingId, address);

    Object.assign(stakeEntity, {
      stakingDepositStatus: PonziDepositStatus.COMPLETE,
    });

    await stakeEntity.save();

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: stakeEntity.account,
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async finishToken(event: ILogEvent<IFinalizedTokenEvent | IPonziFinishEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    // TODO cancel all stakes? (or all TOKEN depost\reward stakes)
  }

  public async withdrawToken(event: ILogEvent<IWithdrawTokenEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      name,
      args: { token, amount },
    } = event;
    const { transactionHash, address } = context;

    const ponziContractEntity = await this.contractService.findOne(
      { address: address.toLowerCase() },
      { relations: { merchant: true } },
    );

    if (!ponziContractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    if (token.toLowerCase() === ZeroAddress) {
      const tokenEntity = await this.tokenService.getToken("0", token.toLowerCase());

      if (!tokenEntity) {
        throw new NotFoundException("tokenNotFound");
      }

      await this.balanceService.decrement(tokenEntity.id, address.toLowerCase(), amount);
    }

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: ponziContractEntity.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }
}
