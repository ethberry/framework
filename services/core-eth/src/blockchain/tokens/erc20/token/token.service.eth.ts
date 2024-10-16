import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Log, ZeroAddress } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IContractManagerERC20TokenDeployedEvent,
  IErc20TokenApproveEvent,
  IErc20TokenTransferEvent,
} from "@framework/types";
import { RmqProviderType, SignalEventType } from "@framework/types";

import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { Erc20TokenServiceLog } from "./token.service.log";

@Injectable()
export class Erc20TokenServiceEth {
  constructor(
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly eventHistoryService: EventHistoryService,
    private readonly tokenService: TokenService,
    private readonly balanceService: BalanceService,
    private readonly erc20TokenServiceLog: Erc20TokenServiceLog,
  ) {}

  public async transfer(event: ILogEvent<IErc20TokenTransferEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);

    const { name, args } = event;
    const { from, to, value } = args;
    const { address, transactionHash } = context;

    const tokenEntity = await this.tokenService.getToken("0", address.toLowerCase());

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    if (from === ZeroAddress) {
      await this.balanceService.increment(tokenEntity.id, to.toLowerCase(), value);
    } else if (to === ZeroAddress) {
      await this.balanceService.decrement(tokenEntity.id, to.toLowerCase(), value);
    } else {
      if (value !== "0") {
        await this.balanceService.increment(tokenEntity.id, to.toLowerCase(), value);
        await this.balanceService.decrement(tokenEntity.id, from.toLowerCase(), value);
      }
    }

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: from === ZeroAddress ? to.toLowerCase() : from.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async approval(event: ILogEvent<IErc20TokenApproveEvent>, context: Log): Promise<void> {
    const { name, args } = event;
    const { owner } = args;

    await this.eventHistoryService.updateHistory(event, context);

    const { transactionHash } = context;

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: owner.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async deploy(event: ILogEvent<IContractManagerERC20TokenDeployedEvent>, context: Log): Promise<void> {
    const {
      args: { account },
    } = event;

    // dummy call to keep interface compatible with same methods
    await Promise.resolve(context);

    this.erc20TokenServiceLog.updateRegistry([account]);
  }
}
