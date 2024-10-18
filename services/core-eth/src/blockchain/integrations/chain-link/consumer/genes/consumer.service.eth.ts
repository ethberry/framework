import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IContractManagerERC721TokenDeployedEvent,
  IERC721TokenMintGenesEvent,
  IERC721TokenMintRandomEvent,
} from "@framework/types";
import {
  ChainLinkEventType,
  ContractFeatures,
  Erc721ContractTemplates,
  RmqProviderType,
  SignalEventType,
} from "@framework/types";

import { EventHistoryService } from "../../../../event-history/event-history.service";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { AssetService } from "../../../../exchange/asset/asset.service";
import { TokenService } from "../../../../hierarchy/token/token.service";
import { ChainLinkConsumerServiceLog } from "./consumer.service.log";

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
    protected readonly chainLinkConsumerServiceLog: ChainLinkConsumerServiceLog,
  ) {}

  public async mintGenes(event: ILogEvent<IERC721TokenMintRandomEvent>, context: Log): Promise<void> {
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

    const eventData = historyEntity.eventData as IERC721TokenMintGenesEvent;
    await this.assetService.updateAssetHistoryRandom(eventData.requestId, tokenEntity.id);

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: to.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public deploy(event: ILogEvent<IContractManagerERC721TokenDeployedEvent>): void {
    const {
      args: { account, args },
    } = event;

    const { contractTemplate } = args;

    const contractFeatures = Object.values(Erc721ContractTemplates)[Number(contractTemplate)].split("_");

    if (!(contractFeatures.includes(ContractFeatures.RANDOM) || contractFeatures.includes(ContractFeatures.GENES))) {
      return;
    }

    this.chainLinkConsumerServiceLog.updateRegistry([account]);
  }
}
