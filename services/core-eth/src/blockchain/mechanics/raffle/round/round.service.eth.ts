import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Log, Wallet } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import {
  IRafflePrizeEvent,
  IRaffleReleaseEvent,
  IRaffleRoundEndedEvent,
  IRaffleRoundFinalizedEvent,
  IRaffleRoundStartedEvent,
  TokenType,
} from "@framework/types";

import { RaffleRoundService } from "./round.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { testChainId } from "@framework/constants";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { NotificatorService } from "../../../../game/notificator/notificator.service";
import { UserService } from "../../../../infrastructure/user/user.service";

@Injectable()
export class RaffleRoundServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(ETHERS_SIGNER)
    private readonly ethersSignerProvider: Wallet,
    private readonly raffleRoundService: RaffleRoundService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly tokenService: TokenService,
    private readonly templateService: TemplateService,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async start(event: ILogEvent<IRaffleRoundStartedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { roundId, startTimestamp, maxTicket, ticket, price },
    } = event;
    const { address } = context;

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    // LOTTERY CONTRACT
    const lotteryContract = await this.contractService.findOne({ address: address.toLowerCase(), chainId });

    if (!lotteryContract) {
      throw new NotFoundException("lotteryContractNotFound");
    }

    // TICKET CONTRACT
    const { token } = ticket;
    const ticketContract = await this.contractService.findOne({ address: token.toLowerCase(), chainId });

    if (!ticketContract) {
      throw new NotFoundException("ticketContractNotFound");
    }

    // PRICE ASSET
    const asset = await this.raffleRoundService.createEmptyPrice();

    const { tokenId, amount } = price;

    const priceTemplate = await this.templateService.findOne(
      { id: Number(tokenId) },
      { relations: { contract: true } },
    );

    if (!priceTemplate) {
      throw new NotFoundException("priceTemplateNotFound");
    }

    const priceAsset = {
      components: [
        {
          tokenType: priceTemplate.contract.contractType || TokenType.NATIVE,
          contractId: priceTemplate.contract.id,
          templateId: priceTemplate.id,
          amount: Number(amount).toString(),
        },
      ],
    };

    await this.raffleRoundService.updatePrice(asset, priceAsset);

    await this.raffleRoundService.create({
      roundId,
      startTimestamp: new Date(Number(startTimestamp) * 1000).toISOString(),
      contractId: lotteryContract.id,
      ticketContractId: ticketContract.id,
      priceId: asset.id,
      maxTickets: Number(maxTicket),
    });
  }

  public async finalize(event: ILogEvent<IRaffleRoundFinalizedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { round, prizeNumber },
    } = event;
    const { address } = context;

    const roundEntity = await this.raffleRoundService.getRound(round, address);

    if (!roundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    // TODO BigInt ?
    Object.assign(roundEntity, { number: Number(prizeNumber).toString() });
    await roundEntity.save();
  }

  public async end(event: ILogEvent<IRaffleRoundEndedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);

    const {
      args: { round, endTimestamp },
    } = event;

    const roundEntity = await this.raffleRoundService.findOne({ roundId: round });

    if (!roundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    Object.assign(roundEntity, {
      endTimestamp: new Date(Number(endTimestamp) * 1000).toISOString(),
    });

    await roundEntity.save();
  }

  public async prize(event: ILogEvent<IRafflePrizeEvent>, context: Log): Promise<void> {
    const {
      args: { account, roundId, ticketId, amount },
    } = event;

    const roundEntity = await this.raffleRoundService.findOne({ roundId }, { relations: { ticketContract: true } });

    if (!roundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    const ticketEntity = await this.tokenService.getToken(ticketId, roundEntity.ticketContract.address.toLowerCase());

    if (!ticketEntity) {
      throw new NotFoundException("ticketNotFound");
    }

    const userEntity = await this.userService.findOne({ wallet: account.toLowerCase() });

    if (!userEntity) {
      this.loggerService.error("CRITICAL ERROR", RaffleRoundServiceEth.name);
      throw new NotFoundException("userNotFound");
    }

    // UPDATE PRIZE METADATA
    Object.assign(ticketEntity.metadata, { PRIZE: amount });
    await ticketEntity.save();

    await this.eventHistoryService.updateHistory(event, context, ticketEntity.id);

    // NOTIFY
    await this.notificatorService.prizeRaffle({
      account: userEntity,
      round: roundEntity,
      ticket: ticketEntity,
      multiplier: amount,
    });
  }

  public async release(event: ILogEvent<IRaffleReleaseEvent>, context: Log): Promise<void> {
    // TODO use it somehow?
    await this.eventHistoryService.updateHistory(event, context);
  }
}
