import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import {
  ILotteryPrizeEvent,
  ILotteryReleaseEvent,
  IRoundEndedEvent,
  IRoundFinalizedEvent,
  IRoundStartedEvent,
  RmqProviderType,
  SignalEventType,
  TokenType,
} from "@framework/types";
import { testChainId } from "@framework/constants";

import { getLotteryNumbers } from "../../../../common/utils";
import { NotificatorService } from "../../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { LotteryRoundService } from "./round.service";
import { LotteryRoundEntity } from "./round.entity";
import { LotteryRoundAggregationService } from "./round.service.aggregation";

@Injectable()
export class LotteryRoundServiceEth {
  constructor(
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly notificatorService: NotificatorService,
    private readonly lotteryRoundService: LotteryRoundService,
    private readonly lotteryRoundAggregationService: LotteryRoundAggregationService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly templateService: TemplateService,
    private readonly tokenService: TokenService,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
  ) {}

  public async lotteryRoundStart(event: ILogEvent<IRoundStartedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      name,
      args: { roundId, startTimestamp, maxTicket, ticket, price },
    } = event;
    const { address, transactionHash } = context;

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    // LOTTERY CONTRACT
    const lotteryContract = await this.contractService.findOne(
      { address: address.toLowerCase(), chainId },
      { relations: { merchant: true } },
    );

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
    const asset = await this.lotteryRoundService.createEmptyPrice();

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

    await this.lotteryRoundService.updatePrice(asset, priceAsset);

    const roundEntity = await this.lotteryRoundService.create({
      roundId,
      startTimestamp: new Date(Number(startTimestamp) * 1000).toISOString(),
      contractId: lotteryContract.id,
      ticketContractId: ticketContract.id,
      priceId: asset.id,
      maxTickets: Number(maxTicket),
    });

    await this.notificatorService.lotteryRoundStart({
      round: Object.assign(roundEntity, { contract: lotteryContract, ticketContract, price: asset }),
      address,
      transactionHash,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: lotteryContract.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async lotteryFinalize(event: ILogEvent<IRoundFinalizedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      name,
      args: { round, winValues },
    } = event;
    const { address, transactionHash } = context;

    const roundEntity = await this.lotteryRoundService.getRound(round, address);

    if (!roundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    Object.assign(roundEntity, { numbers: getLotteryNumbers(winValues) });
    await roundEntity.save();

    await this.aggregate(roundEntity);

    // NOTIFY
    await this.notificatorService.lotteryFinalize({
      round: roundEntity,
      prizeNumbers: winValues,
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

  public async lotteryRoundEnd(event: ILogEvent<IRoundEndedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { round, endTimestamp },
    } = event;
    const { address, transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);

    const roundEntity = await this.lotteryRoundService.getRound(round, address.toLowerCase());

    if (!roundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    Object.assign(roundEntity, {
      endTimestamp: new Date(Number(endTimestamp) * 1000).toISOString(),
    });

    await roundEntity.save();

    await this.notificatorService.lotteryRoundEnd({
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

  public async lotteryPrize(event: ILogEvent<ILotteryPrizeEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { account, roundId, ticketId },
    } = event;
    const { address, transactionHash } = context;

    // const roundEntity = await this.lotteryRoundService.findOne({ roundId }, { relations: { ticketContract: true } });
    const roundEntity = await this.lotteryRoundService.getRound(roundId, address.toLowerCase());

    if (!roundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    const ticketEntity = await this.tokenService.getToken(ticketId, roundEntity.ticketContract.address.toLowerCase());

    if (!ticketEntity) {
      throw new NotFoundException("ticketNotFound");
    }

    // UPDATE PRIZE METADATA
    Object.assign(ticketEntity.metadata, { PRIZE: "1" });
    await ticketEntity.save();

    await this.eventHistoryService.updateHistory(event, context, ticketEntity.id);

    // NOTIFY
    await this.notificatorService.lotteryPrize({
      round: roundEntity,
      ticket: ticketEntity,
      multiplier: "1",
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

  public async release(event: ILogEvent<ILotteryReleaseEvent>, context: Log): Promise<void> {
    // TODO use it somehow
    //  notification?
    await this.eventHistoryService.updateHistory(event, context);
  }

  public async aggregate(roundEntity: LotteryRoundEntity) {
    // TODO
    // - find all tickets for this round
    // - aggregate data for each match
    // - save to aggregation table
    await Promise.all(
      new Array(roundEntity.maxTickets).fill(null).map(async (e, i) => {
        await this.lotteryRoundAggregationService.create({
          round: roundEntity,
          match: i,
          tickets: 42,
          // price
        });
      }),
    );
  }
}
