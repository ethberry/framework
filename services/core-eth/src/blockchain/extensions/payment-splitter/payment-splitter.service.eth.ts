import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Log } from "@ethersproject/abstract-provider";
import { constants } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import type {
  IExchangeErc20PaymentReleasedEvent,
  IExchangePayeeAddedEvent,
  IExchangePaymentReceivedEvent,
  IExchangePaymentReleasedEvent,
} from "@framework/types";
import { testChainId } from "@framework/constants";

import { PayeesService } from "./payee/payees.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { BalanceService } from "../../hierarchy/balance/balance.service";
import { TokenService } from "../../hierarchy/token/token.service";
import { EventHistoryService } from "../../event-history/event-history.service";

@Injectable()
export class PaymentSplitterServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly payeesService: PayeesService,
    private readonly contractService: ContractService,
    private readonly tokenService: TokenService,
    private readonly balanceService: BalanceService,
    private readonly eventHistoryService: EventHistoryService,
  ) {}

  public async addPayee(event: ILogEvent<IExchangePayeeAddedEvent>, context: Log): Promise<void> {
    const {
      args: { account, shares },
    } = event;
    await this.eventHistoryService.updateHistory(event, context);

    const contractEntity = await this.contractService.findOne({ address: context.address.toLowerCase() });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.payeesService.create({
      account: account.toLowerCase(),
      shares: ~~shares,
      contractId: contractEntity.id,
    });
  }

  public async addEth(event: ILogEvent<IExchangePaymentReceivedEvent>, context: Log): Promise<void> {
    const {
      args: { amount },
    } = event;
    await this.eventHistoryService.updateHistory(event, context);

    // get NATIVE token
    const chainId = ~~this.configService.get<number>("CHAIN_ID", testChainId);
    const tokenEntity = await this.tokenService.getToken("0", constants.AddressZero, chainId);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.balanceService.increment(tokenEntity.id, context.address.toLowerCase(), amount);
  }

  public async releaseEth(event: ILogEvent<IExchangePaymentReleasedEvent>, context: Log): Promise<void> {
    const {
      args: { amount },
    } = event;
    await this.eventHistoryService.updateHistory(event, context);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", testChainId);
    const tokenEntity = await this.tokenService.getToken("0", constants.AddressZero.toLowerCase(), chainId);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.balanceService.decrement(tokenEntity.id, context.address.toLowerCase(), amount);
  }

  public async releaseErc20(event: ILogEvent<IExchangeErc20PaymentReleasedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    // Balance will decrement by Erc20 controller
  }
}
