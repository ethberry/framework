import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import { ExchangeEventType, ITransaction, TExchangeEventData } from "@framework/types";

import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";
import { TokenService } from "../../blockchain/hierarchy/token/token.service";
import { BalanceService } from "../../blockchain/hierarchy/balance/balance.service";
import { ExchangeHistoryService } from "./exchange-history/exchange-history.service";
import { ExchangeService } from "./exchange.service";

@Injectable()
export class ExchangeServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly contractManagerService: ContractManagerService,
    private readonly exchangeService: ExchangeService,
    private readonly exchangeHistoryService: ExchangeHistoryService,
    private readonly tokenService: TokenService,
    private readonly balanceService: BalanceService,
  ) {}

  public async transaction(event: ILogEvent<ITransaction>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
    const {
      args: { from, items },
    } = event;

    const item = items[0];
    const itemTokenId = item[2];
    const itemTokenAmount = item[3];

    const tokenEntity = await this.tokenService.findOne({ id: ~~itemTokenId });

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.balanceService.increment(tokenEntity.id, from.toLowerCase(), itemTokenAmount);
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
