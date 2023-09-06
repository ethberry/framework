import { Injectable, NotFoundException } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import { IErc4907UpdateUserEvent } from "@framework/types";

import { NotificatorService } from "../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { TokenService } from "../../hierarchy/token/token.service";

@Injectable()
export class RentServiceEth {
  constructor(
    private readonly tokenService: TokenService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async updateUser(event: ILogEvent<IErc4907UpdateUserEvent>, context: Log): Promise<void> {
    const {
      args: { tokenId, user, expires },
    } = event;
    const { address } = context;

    const erc721TokenEntity = await this.tokenService.getToken(Number(tokenId).toString(), address.toLowerCase());

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, erc721TokenEntity.id);

    await this.notificatorService.updateUser({
      merchantId: erc721TokenEntity.template.contract.merchantId,
      tokenId,
      user,
      expires,
    });
  }
}
