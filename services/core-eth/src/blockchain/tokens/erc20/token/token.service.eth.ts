import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log, ZeroAddress } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import { IErc20TokenApproveEvent, IErc20TokenSnapshotEvent, IErc20TokenTransferEvent } from "@framework/types";

import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { EventHistoryService } from "../../../event-history/event-history.service";

@Injectable()
export class Erc20TokenServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly contractService: ContractService,
    private readonly tokenService: TokenService,
    private readonly balanceService: BalanceService,
  ) {}

  public async transfer(event: ILogEvent<IErc20TokenTransferEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);

    const { args } = event;
    const { from, to, value } = args;
    const { address } = context;

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
  }

  public async approval(event: ILogEvent<IErc20TokenApproveEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }

  public async snapshot(event: ILogEvent<IErc20TokenSnapshotEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }
}
