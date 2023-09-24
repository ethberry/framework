import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { Log, Wallet } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import { ETHERS_SIGNER } from "@gemunion/nest-js-module-ethers-gcp";
import {
  IRafflePrizeEvent,
  IRaffleReleaseEvent,
  IRaffleRoundEndedEvent,
  IRaffleRoundFinalizedEvent,
  IRaffleRoundStartedEvent,
  RmqProviderType,
  SignalEventType,
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
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly raffleRoundService: RaffleRoundService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly tokenService: TokenService,
    private readonly templateService: TemplateService,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async raffleRoundStart(event: ILogEvent<IRaffleRoundStartedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      name,
      args: { roundId, startTimestamp, maxTicket, ticket, price },
    } = event;
    const { address, transactionHash } = context;

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    // RAFFLE CONTRACT
    const raffleContract = await this.contractService.findOne(
      { address: address.toLowerCase(), chainId },
      { relations: { merchant: true } },
    );

    if (!raffleContract) {
      throw new NotFoundException("raffleContractNotFound");
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

    const roundEntity = await this.raffleRoundService.create({
      roundId,
      startTimestamp: new Date(Number(startTimestamp) * 1000).toISOString(),
      contractId: raffleContract.id,
      ticketContractId: ticketContract.id,
      priceId: asset.id,
      maxTickets: Number(maxTicket),
    });

    await this.notificatorService.raffleRoundStart({
      round: Object.assign(roundEntity, { contract: raffleContract, ticketContract, price: asset }),
      address,
      transactionHash,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: raffleContract.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async raffleFinalize(event: ILogEvent<IRaffleRoundFinalizedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      name,
      args: { round, prizeNumber, prizeIndex },
    } = event;
    const { address, transactionHash } = context;

    const roundEntity = await this.raffleRoundService.getRound(round, address);

    if (!roundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    Object.assign(roundEntity, { number: Number(prizeNumber).toString() });
    await roundEntity.save();

    // NOTIFY
    await this.notificatorService.raffleFinalize({
      round: roundEntity,
      prizeIndex,
      prizeNumber,
      address,
      transactionHash,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: roundEntity.contract.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async raffleRoundEnd(event: ILogEvent<IRaffleRoundEndedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { round, endTimestamp },
    } = event;
    const { address, transactionHash } = context;

    const roundEntity = await this.raffleRoundService.getRound(round, address.toLowerCase());

    if (!roundEntity) {
      throw new NotFoundException("roundNotFound");
    }
    await this.eventHistoryService.updateHistory(event, context, void 0, roundEntity.contractId);

    Object.assign(roundEntity, {
      endTimestamp: new Date(Number(endTimestamp) * 1000).toISOString(),
    });

    await roundEntity.save();

    await this.notificatorService.raffleRoundEnd({
      round: roundEntity,
      address,
      transactionHash,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: roundEntity.contract.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async rafflePrize(event: ILogEvent<IRafflePrizeEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { account, roundId, ticketId, amount },
    } = event;
    const { address, transactionHash } = context;

    const roundEntity = await this.raffleRoundService.findOne(
      { roundId },
      { relations: { contract: true, ticketContract: true } },
    );

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
    await this.notificatorService.rafflePrize({
      round: roundEntity,
      ticket: ticketEntity,
      multiplier: amount,
      address,
      transactionHash,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: account.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async release(event: ILogEvent<IRaffleReleaseEvent>, context: Log): Promise<void> {
    // TODO use it somehow
    //  notification?
    await this.eventHistoryService.updateHistory(event, context);
  }
}
