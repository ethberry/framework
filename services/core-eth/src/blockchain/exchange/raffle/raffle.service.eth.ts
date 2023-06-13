import { Injectable, NotFoundException } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IExchangePurchaseRaffleEvent } from "@framework/types";

import { AssetService } from "../asset/asset.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { RaffleRoundService } from "../../mechanics/raffle/round/round.service";
import { TokenService } from "../../hierarchy/token/token.service";
import { RaffleTicketService } from "../../mechanics/raffle/ticket/ticket.service";

@Injectable()
export class ExchangeRaffleServiceEth {
  constructor(
    private readonly assetService: AssetService,
    private readonly tokenService: TokenService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly raffleRoundService: RaffleRoundService,
    private readonly raffleTicketService: RaffleTicketService,
  ) {}

  public async purchaseRaffle(event: ILogEvent<IExchangePurchaseRaffleEvent>, context: Log): Promise<void> {
    const {
      args: { account, roundId, items, price },
    } = event;

    const history = await this.eventHistoryService.updateHistory(event, context);

    const [_raffleType, raffle, _raffleToken, _raffleAmount] = items[0]; // Raffle contract
    const [_type, ticket, ticketId, _amount] = items[1]; // Ticket contract

    const roundEntity = await this.raffleRoundService.getRound(roundId, raffle.toLowerCase());

    if (!roundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    const tokenEntity = await this.tokenService.getToken(Number(ticketId).toString(), ticket.toLowerCase());

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.raffleTicketService.create({
      account: account.toLowerCase(),
      roundId: roundEntity.id,
      tokenId: tokenEntity.id,
    });

    await this.assetService.saveAssetHistory(history, [items[1]] /* [raffle, ticket] */, [price]);
  }
}
