import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Log, Wallet } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import { ETHERS_SIGNER } from "@gemunion/nest-js-module-ethers-gcp";
import {
  ILotteryPrizeEvent,
  ILotteryReleaseEvent,
  IRoundEndedEvent,
  IRoundFinalizedEvent,
  IRoundStartedEvent,
  TokenType,
} from "@framework/types";

import { LotteryRoundService } from "./round.service";
import { getLotteryNumbers } from "../../../../common/utils";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { testChainId } from "@framework/constants";
import { TokenService } from "../../../hierarchy/token/token.service";

@Injectable()
export class LotteryRoundServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly lotteryRoundService: LotteryRoundService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly templateService: TemplateService,
    private readonly tokenService: TokenService,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
    @Inject(ETHERS_SIGNER)
    private readonly ethersSignerProvider: Wallet,
  ) {}

  public async start(event: ILogEvent<IRoundStartedEvent>, context: Log): Promise<void> {
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

    await this.lotteryRoundService.create({
      roundId,
      startTimestamp: new Date(Number(startTimestamp) * 1000).toISOString(),
      contractId: lotteryContract.id,
      ticketContractId: ticketContract.id,
      priceId: asset.id,
      maxTickets: Number(maxTicket),
    });
  }

  public async finalize(event: ILogEvent<IRoundFinalizedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { round, winValues },
    } = event;
    const { address } = context;

    const roundEntity = await this.lotteryRoundService.getRound(round, address);

    if (!roundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    Object.assign(roundEntity, { numbers: getLotteryNumbers(winValues) });
    await roundEntity.save();
  }

  public async end(event: ILogEvent<IRoundEndedEvent>, context: Log): Promise<void> {
    const {
      args: { round, endTimestamp },
    } = event;
    const { address } = context;

    await this.eventHistoryService.updateHistory(event, context);

    const roundEntity = await this.lotteryRoundService.getRound(round, address.toLowerCase());

    if (!roundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    Object.assign(roundEntity, {
      endTimestamp: new Date(Number(endTimestamp) * 1000).toISOString(),
    });

    await roundEntity.save();
  }

  public async prize(event: ILogEvent<ILotteryPrizeEvent>, context: Log): Promise<void> {
    const {
      args: { roundId, ticketId },
    } = event;
    const { address } = context;

    // const { address } = context;
    // TODO use it, check ticketId?
    // TODO find ticket.round.ticketContract.address
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
  }

  public async release(event: ILogEvent<ILotteryReleaseEvent>, context: Log): Promise<void> {
    // TODO use it somehow
    //  notification?
    await this.eventHistoryService.updateHistory(event, context);
  }
}
