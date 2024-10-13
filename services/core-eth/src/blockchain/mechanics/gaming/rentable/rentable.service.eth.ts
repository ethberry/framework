import { Injectable, NotFoundException } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { IRentableUpdateUserEvent } from "@framework/types";

import { TokenService } from "../../../hierarchy/token/token.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { NotificatorService } from "../../../../game/notificator/notificator.service";

@Injectable()
export class RentableServiceEth {
  constructor(
    private readonly tokenService: TokenService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async updateUser(event: ILogEvent<IRentableUpdateUserEvent>, context: Log): Promise<void> {
    const {
      args: { tokenId, user, expires },
    } = event;
    const { address } = context;

    const erc721TokenEntity = await this.tokenService.getToken(tokenId, address.toLowerCase());

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }
    // SAVE USER TO METADATA
    Object.assign(erc721TokenEntity.metadata, { USER: user.toLowerCase() });
    await erc721TokenEntity.save();

    await this.eventHistoryService.updateHistory(event, context, erc721TokenEntity.id);

    await this.notificatorService.updateUser({
      merchantId: erc721TokenEntity.template.contract.merchantId,
      tokenId,
      user,
      expires,
    });
  }
}
