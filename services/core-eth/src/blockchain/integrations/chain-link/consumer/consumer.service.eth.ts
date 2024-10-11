import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import {
  ChainLinkEventType,
  IERC721TokenMintRandomEvent,
  IVrfSubscriptionSetEvent,
  RmqProviderType,
  SignalEventType,
} from "@framework/types";
import { testChainId } from "@framework/constants";

import { EventHistoryService } from "../../../event-history/event-history.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { AssetService } from "../../../exchange/asset/asset.service";
import { TokenService } from "../../../hierarchy/token/token.service";

@Injectable()
export class ChainLinkConsumerServiceEth {
  constructor(
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    protected readonly configService: ConfigService,
    protected readonly contractService: ContractService,
    protected readonly eventHistoryService: EventHistoryService,
    protected readonly assetService: AssetService,
    protected readonly tokenService: TokenService,
  ) {}

  public async setVrfSubscription(event: ILogEvent<IVrfSubscriptionSetEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { subId },
    } = event;
    const { address, transactionHash } = context;

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const contractEntity = await this.contractService.findOne(
      { address: address.toLowerCase(), chainId },
      { relations: { merchant: true } },
    );

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.contractService.updateParameter({ id: contractEntity.id }, "vrfSubId", subId);
    await this.eventHistoryService.updateHistory(event, context);
    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: contractEntity.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async mintRandom(event: ILogEvent<IERC721TokenMintRandomEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      name,
      args: { to, tokenId },
    } = event;
    const { address, transactionHash } = context;

    const tokenEntity = await this.tokenService.getToken(Number(tokenId).toString(), address.toLowerCase(), true);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const historyEntity = await this.eventHistoryService.findOne({
      transactionHash,
      eventType: ChainLinkEventType.MintRandom,
    });

    if (!historyEntity) {
      throw new NotFoundException("historyNotFound");
    }

    const eventData = historyEntity.eventData as IERC721TokenMintRandomEvent;
    await this.assetService.updateAssetHistoryRandom(eventData.requestId, tokenEntity.id);

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: to.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }
}
