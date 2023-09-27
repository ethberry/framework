import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { Log } from "ethers";

import { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import {
  IVrfSubscriptionCreatedEvent,
  IVrfSubscriptionSetEvent,
  RmqProviderType,
  SignalEventType,
} from "@framework/types";
import { testChainId } from "@framework/constants";

import { EventHistoryService } from "../../../event-history/event-history.service";
import { MerchantService } from "../../../../infrastructure/merchant/merchant.service";
import { ChainLinkSubscriptionService } from "./subscription.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class ChainLinkSubscriptionServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    protected readonly configService: ConfigService,
    protected readonly chainLinkSubscriptionService: ChainLinkSubscriptionService,
    protected readonly merchantService: MerchantService,
    protected readonly contractService: ContractService,
    protected readonly eventHistoryService: EventHistoryService,
  ) {}

  public async createSubscription(event: ILogEvent<IVrfSubscriptionCreatedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { owner, subId },
    } = event;
    const { transactionHash } = context;

    // Check if it's our merchant
    const merchant = await this.merchantService.findOne({ wallet: owner.toLowerCase() });

    if (merchant) {
      await this.eventHistoryService.updateHistory(event, context);
      const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
      await this.chainLinkSubscriptionService.create({ merchant, chainId, vrfSubId: Number(subId) });

      await this.signalClientProxy
        .emit(SignalEventType.TRANSACTION_HASH, {
          account: owner.toLowerCase(),
          transactionHash,
          transactionType: name,
        })
        .toPromise();
    }
  }

  public async setVrfSubscription(event: ILogEvent<IVrfSubscriptionSetEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { subId },
    } = event;
    const { address, transactionHash } = context;

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    // Check if it's our merchant
    const contractEntity = await this.contractService.findOne(
      { address: address.toLowerCase(), chainId },
      { relations: { merchant: true } },
    );

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    Object.assign(contractEntity.parameters, { vrfSubId: subId });
    await contractEntity.save();

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: contractEntity.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }
}
