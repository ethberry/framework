import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { JsonRpcProvider, Log, Wallet } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { ETHERS_RPC, ETHERS_SIGNER } from "@ethberry/nest-js-module-ethers-gcp";

import { emptyStateString } from "@ethberry/draft-js-utils";
import { imageUrl, testChainId } from "@framework/constants";
import type { IContractManagerCollectionDeployedEvent } from "@framework/types";
import {
  CollectionContractTemplates,
  ContractFeatures,
  ModuleType,
  RmqProviderType,
  SignalEventType,
  TemplateStatus,
  TokenType,
} from "@framework/types";

import { UserService } from "../../../infrastructure/user/user.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { TemplateService } from "../../hierarchy/template/template.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { ContractManagerServiceEth } from "../cm.service";

@Injectable()
export class ContractManagerCollectionServiceEth extends ContractManagerServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(ETHERS_SIGNER)
    protected readonly ethersSignerProvider: Wallet,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    protected readonly configService: ConfigService,
    protected readonly eventHistoryService: EventHistoryService,
    protected readonly contractService: ContractService,
    protected readonly templateService: TemplateService,
    protected readonly userService: UserService,
  ) {
    super(loggerService, userService);
  }

  public async deploy(event: ILogEvent<IContractManagerCollectionDeployedEvent>, context: Log): Promise<void> {
    const {
      args: { account, args, externalId },
    } = event;
    const { transactionHash } = context;

    const { name, symbol, royalty, baseTokenURI, batchSize, contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, context);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const contractFeatures =
      contractTemplate === "0"
        ? []
        : (Object.values(CollectionContractTemplates)[Number(contractTemplate)].split("_") as Array<ContractFeatures>);

    const contractEntity = await this.contractService.create({
      address: account.toLowerCase(),
      title: name,
      name,
      symbol,
      description: emptyStateString,
      parameters: {
        batchSize: Number(batchSize),
      },
      imageUrl,
      contractFeatures,
      contractType: TokenType.ERC721,
      contractModule: ModuleType.COLLECTION,
      chainId,
      royalty: Number(royalty),
      baseTokenURI,
      merchantId: await this.getMerchantId(externalId),
    });

    await this.templateService.createTemplate({
      title: name,
      description: emptyStateString,
      imageUrl,
      cap: "0",
      contractId: contractEntity.id,
      templateStatus: TemplateStatus.HIDDEN,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.getUserWalletById(externalId),
        transactionHash,
        transactionType: event.name,
      })
      .toPromise();
  }
}
