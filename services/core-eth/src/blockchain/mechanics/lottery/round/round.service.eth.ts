import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Log, Wallet } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import {
  IAssetDto,
  ILotteryPrizeEvent,
  ILotteryReleaseEvent,
  IRoundEndedEvent,
  IRoundFinalizedEvent,
  IRoundStartedEvent,
} from "@framework/types";

import { LotteryRoundService } from "./round.service";
import { getLotteryNumbers } from "../../../../common/utils";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { testChainId } from "@framework/constants";

@Injectable()
export class LotteryRoundServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly lotteryRoundService: LotteryRoundService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly templateService: TemplateService,
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
    const priceAsset: IAssetDto = await this.lotteryRoundService.createEmptyAsset();

    const { tokenId, amount } = price;

    const priceTemplate = await this.templateService.findOne(
      { id: Number(tokenId) },
      { relations: { contract: true } },
    );

    if (!priceTemplate) {
      throw new NotFoundException("priceTemplateNotFound");
    }

    priceAsset.components.push({
      tokenType: priceTemplate.contract.contractType,
      contractId: priceTemplate.contract.id,
      templateId: priceTemplate.id,
      amount: Number(amount).toString(),
    });

    await this.lotteryRoundService.create({
      roundId,
      startTimestamp: new Date(Number(startTimestamp) * 1000).toISOString(),
      contractId: lotteryContract.id,
      ticketContractId: ticketContract.id,
      price: priceAsset,
      maxTickets: Number(maxTicket),
    });
  }

  public async finalize(event: ILogEvent<IRoundFinalizedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { round, winValues },
    } = event;

    const roundEntity = await this.lotteryRoundService.findOne({ roundId: round });

    if (!roundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    Object.assign(roundEntity, { numbers: getLotteryNumbers(winValues) });
    await roundEntity.save();
  }

  public async end(event: ILogEvent<IRoundEndedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);

    const {
      args: { round, endTimestamp },
    } = event;

    const roundEntity = await this.lotteryRoundService.findOne({ roundId: round });

    if (!roundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    Object.assign(roundEntity, {
      endTimestamp: new Date(Number(endTimestamp) * 1000).toISOString(),
    });

    await roundEntity.save();
  }

  public async prize(event: ILogEvent<ILotteryPrizeEvent>, context: Log): Promise<void> {
    // TODO use it, check ticketId?
    await this.eventHistoryService.updateHistory(event, context);
  }

  public async release(event: ILogEvent<ILotteryReleaseEvent>, context: Log): Promise<void> {
    // TODO use it somehow?
    await this.eventHistoryService.updateHistory(event, context);
  }
}
