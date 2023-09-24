import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Log } from "ethers";

import { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";

import {
  IERC721TokenApprovedForAllEvent,
  IERC721TokenApproveEvent,
  RmqProviderType,
  SignalEventType,
} from "@framework/types";

import { TokenService } from "./token.service";
import { EventHistoryService } from "../../event-history/event-history.service";

@Injectable()
export class TokenServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    protected readonly tokenService: TokenService,
    protected readonly eventHistoryService: EventHistoryService,
  ) {}

  public async approval(event: ILogEvent<IERC721TokenApproveEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { owner, tokenId },
    } = event;
    const { transactionHash } = context;

    const tokenEntity = await this.tokenService.getToken(Number(tokenId).toString(), context.address.toLowerCase());

    if (!tokenEntity) {
      this.loggerService.error("tokenNotFound", tokenId, context.address.toLowerCase(), TokenServiceEth.name);
      throw new NotFoundException("tokenNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, tokenEntity.id);

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: owner.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async approvalForAll(event: ILogEvent<IERC721TokenApprovedForAllEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }
}
