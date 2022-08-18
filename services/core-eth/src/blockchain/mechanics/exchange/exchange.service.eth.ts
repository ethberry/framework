import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ClaimStatus,
  ExchangeEventType,
  IExchangeClaim,
  IExchangeCraft,
  IExchangeGrade,
  IExchangeMysterybox,
  IExchangePurchase,
  TExchangeEventData,
} from "@framework/types";

import { ContractManagerService } from "../../contract-manager/contract-manager.service";
import { ExchangeHistoryService } from "./history/exchange-history.service";
import { ExchangeService } from "./exchange.service";
import { ClaimService } from "../claim/claim.service";

@Injectable()
export class ExchangeServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly contractManagerService: ContractManagerService,
    private readonly exchangeService: ExchangeService,
    private readonly claimService: ClaimService,
    private readonly exchangeHistoryService: ExchangeHistoryService,
  ) {}

  public async log(
    event: ILogEvent<IExchangePurchase | IExchangeClaim | IExchangeCraft | IExchangeGrade | IExchangeMysterybox>,
    context: Log,
  ): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async claim(event: ILogEvent<IExchangeClaim>, context: Log): Promise<void> {
    await this.updateHistory(event, context);

    const { args } = event;
    const { externalId } = args;

    const claimEntity = await this.claimService.findOne({ id: ~~externalId });

    if (!claimEntity) {
      throw new NotFoundException("claimNotFound");
    }

    Object.assign(claimEntity, { claimStatus: ClaimStatus.REDEEMED });
    await claimEntity.save();
  }

  private async updateHistory(event: ILogEvent<TExchangeEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), ExchangeServiceEth.name);

    const { args, name } = event;

    const { transactionHash, address, blockNumber } = context;

    await this.exchangeHistoryService.create({
      address,
      transactionHash,
      eventType: name as ExchangeEventType,
      eventData: args,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
