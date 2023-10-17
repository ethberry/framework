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

    const raffleContractEntity = await this.contractService.findOne(
      { address: address.toLowerCase(), chainId },
      { relations: { merchant: true } },
    );

    if (!raffleContractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    // TICKET CONTRACT
    const { token } = ticket;
    const ticketContractEntity = await this.contractService.findOne({ address: token.toLowerCase(), chainId });

    if (!ticketContractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    // PRICE ASSET
    const assetEntity = await this.raffleRoundService.createEmptyPrice();

    const { tokenId, amount } = price;

    const priceTemplateEntity = await this.templateService.findOne(
      { id: Number(tokenId) },
      { relations: { contract: true } },
    );

    if (!priceTemplateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    await this.raffleRoundService.updatePrice(assetEntity, {
      components: [
        {
          tokenType: priceTemplateEntity.contract.contractType || TokenType.NATIVE,
          contractId: priceTemplateEntity.contract.id,
          templateId: priceTemplateEntity.id,
          amount: Number(amount).toString(),
        },
      ],
    });

    const raffleRoundEntity = await this.raffleRoundService.create({
      roundId,
      startTimestamp: new Date(Number(startTimestamp) * 1000).toISOString(),
      contractId: raffleContractEntity.id,
      ticketContractId: ticketContractEntity.id,
      priceId: assetEntity.id,
      maxTickets: Number(maxTicket),
    });

    Object.assign(
      raffleContractEntity.parameters,
      Object.assign(raffleContractEntity.parameters, {
        roundId: raffleRoundEntity.id,
      }),
    );
    await raffleContractEntity.save();

    await this.notificatorService.raffleRoundStart({
      round: Object.assign(raffleRoundEntity, {
        contract: raffleContractEntity,
        ticketContract: ticketContractEntity,
        price: assetEntity,
      }),
      address,
      transactionHash,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: raffleContractEntity.merchant.wallet.toLowerCase(),
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

    const raffleRoundEntity = await this.raffleRoundService.getRound(round, address);

    if (!raffleRoundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    Object.assign(raffleRoundEntity, { number: Number(prizeNumber).toString() });
    await raffleRoundEntity.save();

    // NOTIFY
    await this.notificatorService.raffleFinalize({
      round: raffleRoundEntity,
      prizeIndex,
      prizeNumber,
      address,
      transactionHash,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: raffleRoundEntity.contract.merchant.wallet.toLowerCase(),
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

    const raffleRoundEntity = await this.raffleRoundService.getRound(round, address.toLowerCase());

    if (!raffleRoundEntity) {
      throw new NotFoundException("roundNotFound");
    }
    await this.eventHistoryService.updateHistory(event, context, void 0, raffleRoundEntity.contractId);

    Object.assign(raffleRoundEntity, {
      endTimestamp: new Date(Number(endTimestamp) * 1000).toISOString(),
    });

    await raffleRoundEntity.save();

    const raffleContractEntity = await this.contractService.findOne({ id: raffleRoundEntity.contractId });

    if (!raffleContractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    Object.assign(
      raffleContractEntity.parameters,
      Object.assign(raffleContractEntity.parameters, {
        roundId: null,
      }),
    );
    await raffleContractEntity.save();

    await this.notificatorService.raffleRoundEnd({
      round: raffleRoundEntity,
      address,
      transactionHash,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: raffleRoundEntity.contract.merchant.wallet.toLowerCase(),
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

    const raffleRoundEntity = await this.raffleRoundService.findOne(
      { roundId },
      { relations: { contract: true, ticketContract: true } },
    );

    if (!raffleRoundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    const ticketContractEntity = await this.tokenService.getToken(
      ticketId,
      raffleRoundEntity.ticketContract.address.toLowerCase(),
    );

    if (!ticketContractEntity) {
      throw new NotFoundException("ticketNotFound");
    }

    const userEntity = await this.userService.findOne({ wallet: account.toLowerCase() });

    if (!userEntity) {
      this.loggerService.error("CRITICAL ERROR", RaffleRoundServiceEth.name);
      throw new NotFoundException("userNotFound");
    }

    // UPDATE PRIZE METADATA
    Object.assign(ticketContractEntity.metadata, { PRIZE: amount });
    await ticketContractEntity.save();

    await this.eventHistoryService.updateHistory(event, context, ticketContractEntity.id);

    // NOTIFY
    await this.notificatorService.rafflePrize({
      round: raffleRoundEntity,
      ticket: ticketContractEntity,
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
