import { Injectable, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";

import { IERC721TokenApprovedForAllEvent, IERC721TokenApproveEvent } from "@framework/types";

import { TokenService } from "./token.service";
import { EventHistoryService } from "../../event-history/event-history.service";

@Injectable()
export class TokenServiceEth {
  constructor(
    protected readonly tokenService: TokenService,
    protected readonly eventHistoryService: EventHistoryService,
  ) {}

  public async approval(event: ILogEvent<IERC721TokenApproveEvent>, context: Log): Promise<void> {
    const {
      args: { tokenId },
    } = event;

    const tokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, tokenEntity.id);
  }

  public async approvalForAll(event: ILogEvent<IERC721TokenApprovedForAllEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }
}
