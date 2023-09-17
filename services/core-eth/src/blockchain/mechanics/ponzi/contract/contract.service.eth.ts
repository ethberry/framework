import { Injectable, NotFoundException } from "@nestjs/common";
import { Log, ZeroAddress } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IWithdrawTokenEvent } from "@framework/types";

import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { EventHistoryService } from "../../../event-history/event-history.service";

@Injectable()
export class PonziContractServiceEth {
  constructor(
    private readonly eventHistoryService: EventHistoryService,
    private readonly balanceService: BalanceService,
    private readonly tokenService: TokenService,
  ) {}

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
