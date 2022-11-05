import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Log } from "@ethersproject/abstract-provider";
import { constants } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import type {
  IExchangePayeeAddedEvent,
  IExchangePaymentReceivedEvent,
  IExchangePaymentReleasedEvent,
  IExchangeErc20PaymentReleasedEvent,
} from "@framework/types";
import { ExchangeEventType, TExchangeEventData } from "@framework/types";
import { ExchangeHistoryService } from "../mechanics/exchange/history/exchange-history.service";
import { PayeesService } from "./payees.service";
import { ContractService } from "../hierarchy/contract/contract.service";
import { BalanceService } from "../hierarchy/balance/balance.service";
import { TokenService } from "../hierarchy/token/token.service";

@Injectable()
export class WalletServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly payeesService: PayeesService,
    private readonly contractService: ContractService,
    private readonly tokenService: TokenService,
    private readonly balanceService: BalanceService,
    private readonly exchangeHistoryService: ExchangeHistoryService,
  ) {}

  public async addPayee(event: ILogEvent<IExchangePayeeAddedEvent>, context: Log): Promise<void> {
    const {
      args: { account, shares },
    } = event;
    await this.updateHistory(event, context);

    await this.payeesService.create({ account: account.toLowerCase(), shares: ~~shares });
  }

  public async addEth(event: ILogEvent<IExchangePaymentReceivedEvent>, context: Log): Promise<void> {
    const {
      args: { amount },
    } = event;
    await this.updateHistory(event, context);

    const tokenEntity = await this.tokenService.getToken("0", constants.AddressZero, this.contractService.chainId);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const exchangeAddr = this.configService.get<string>("EXCHANGE_ADDR", "");

    await this.balanceService.increment(tokenEntity.id, exchangeAddr.toLowerCase(), amount);
  }

  public async sentEth(event: ILogEvent<IExchangePaymentReceivedEvent>, context: Log): Promise<void> {
    const {
      args: { amount },
    } = event;
    await this.updateHistory(event, context);

    const tokenEntity = await this.tokenService.getToken("0", constants.AddressZero, this.contractService.chainId);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const exchangeAddr = this.configService.get<string>("EXCHANGE_ADDR", "");

    await this.balanceService.decrement(tokenEntity.id, exchangeAddr.toLowerCase(), amount);
  }

  public async releaseEth(event: ILogEvent<IExchangePaymentReleasedEvent>, context: Log): Promise<void> {
    const {
      args: { amount },
    } = event;
    await this.updateHistory(event, context);

    const tokenEntity = await this.tokenService.getToken(
      "0",
      constants.AddressZero.toLowerCase(),
      this.contractService.chainId,
    );

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const exchangeAddr = this.configService.get<string>("EXCHANGE_ADDR", "");

    await this.balanceService.decrement(tokenEntity.id, exchangeAddr.toLowerCase(), amount);
  }

  public async releaseErc20(event: ILogEvent<IExchangeErc20PaymentReleasedEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
    // Balance will decrement by Erc20 controller
  }

  private async updateHistory(event: ILogEvent<TExchangeEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), WalletServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.exchangeHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: name as ExchangeEventType,
      eventData: args,
    });

    await this.contractService.updateLastBlockByAddr(address.toLowerCase(), parseInt(blockNumber.toString(), 16));
  }
}
