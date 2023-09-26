import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Log } from "ethers";

import { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import { IVrfSubscriptionCreatedEvent } from "@framework/types";
import { testChainId } from "@framework/constants";

import { EventHistoryService } from "../../../event-history/event-history.service";
import { MerchantService } from "../../../../infrastructure/merchant/merchant.service";
import { ChainLinkSubscriptionService } from "./subscription.service";

@Injectable()
export class ChainLinkSubscriptionServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    protected readonly configService: ConfigService,
    protected readonly chainLinkSubscriptionService: ChainLinkSubscriptionService,
    protected readonly merchantService: MerchantService,
    protected readonly eventHistoryService: EventHistoryService,
  ) {}

  public async createSubscription(event: ILogEvent<IVrfSubscriptionCreatedEvent>, context: Log): Promise<void> {
    const {
      args: { owner, subId },
    } = event;

    // Check if it's our merchant
    const merchant = await this.merchantService.findOne({ wallet: owner.toLowerCase() });

    if (merchant) {
      await this.eventHistoryService.updateHistory(event, context);
      const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
      await this.chainLinkSubscriptionService.create({ merchant, chainId, vrfSubId: Number(subId) });
    }
  }
}
