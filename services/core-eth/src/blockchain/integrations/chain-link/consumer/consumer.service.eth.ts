import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IContractManagerCommonDeployedEvent,
  IContractManagerERC1155TokenDeployedEvent,
  IContractManagerERC721TokenDeployedEvent,
  IVrfSubscriptionSetEvent,
} from "@framework/types";
import {
  ContractFeatures,
  Erc721ContractTemplates,
  Erc998ContractTemplates,
  RmqProviderType,
  SignalEventType,
} from "@framework/types";
import { testChainId } from "@framework/constants";

import { EventHistoryService } from "../../../event-history/event-history.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { AssetService } from "../../../exchange/asset/asset.service";
import { TokenService } from "../../../hierarchy/token/token.service";
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

  public deploy1(event: ILogEvent<IContractManagerERC721TokenDeployedEvent>): void {
    const {
      args: { account, args },
    } = event;

    const { contractTemplate } = args;

    const contractFeatures = Object.values(Erc721ContractTemplates)[Number(contractTemplate)].split("_");
    if (
      !(
        contractFeatures.includes(ContractFeatures.RANDOM) ||
        contractFeatures.includes(ContractFeatures.GENES) ||
        contractFeatures.includes(ContractFeatures.TRAITS)
      )
    ) {
      return;
    }

    this.chainLinkConsumerServiceLog.updateRegistry([account]);
  }

  public deploy2(event: ILogEvent<IContractManagerERC1155TokenDeployedEvent>): void {
    const {
      args: { account, args },
    } = event;

    const { contractTemplate } = args;

    const contractFeatures = Object.values(Erc998ContractTemplates)[Number(contractTemplate)].split("_");
    if (!contractFeatures.includes(ContractFeatures.RANDOM)) {
      return;
    }

    this.chainLinkConsumerServiceLog.updateRegistry([account]);
  }

  public deploy3(event: ILogEvent<IContractManagerCommonDeployedEvent>): void {
    const {
      args: { account },
    } = event;

    this.chainLinkConsumerServiceLog.updateRegistry([account]);
  }
}