import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { JsonRpcProvider, Log, Wallet } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { ETHERS_RPC, ETHERS_SIGNER } from "@ethberry/nest-js-module-ethers-gcp";

import { emptyStateString } from "@ethberry/draft-js-utils";
import { imageUrl, testChainId } from "@framework/constants";
import type { IContractManagerERC721TokenDeployedEvent } from "@framework/types";
import {
  ContractFeatures,
  Erc721ContractTemplates,
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

@Injectable()
export class ContractManagerErc721ServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(ETHERS_SIGNER)
    protected readonly ethersSignerProvider: Wallet,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly configService: ConfigService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly contractService: ContractService,
    private readonly templateService: TemplateService,
    private readonly userService: UserService,
  ) {}

  public async erc721Token(event: ILogEvent<IContractManagerERC721TokenDeployedEvent>, context: Log): Promise<void> {
    const {
      args: { account, args, externalId },
    } = event;
    const { transactionHash } = context;

    const { name, symbol, royalty, baseTokenURI, contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, context);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const { contractFeatures, contractModule } = this.parseErc721Template(contractTemplate);

    const contractEntity = await this.contractService.create({
      address: account.toLowerCase(),
      title: name,
      name,
      symbol,
      description: emptyStateString,
      imageUrl,
      contractFeatures,
      contractType: TokenType.ERC721,
      contractModule,
      chainId,
      royalty: Number(royalty),
      baseTokenURI,
      fromBlock: parseInt(context.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    if (contractEntity.contractFeatures.includes(ContractFeatures.GENES)) {
      await this.templateService.create({
        title: name,
        description: emptyStateString,
        imageUrl,
        cap: (1024 * 1024 * 1024 * 4).toString(),
        contractId: contractEntity.id,
        templateStatus: TemplateStatus.HIDDEN,
      });
    }

    if (contractEntity.contractModule === ModuleType.LOTTERY || contractEntity.contractModule === ModuleType.RAFFLE) {
      // CREATE TEMPLATE TICKET
      await this.templateService.create({
        title: name,
        description: emptyStateString,
        imageUrl,
        contractId: contractEntity.id,
        templateStatus: TemplateStatus.ACTIVE,
      });
    }

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.getUserWalletById(externalId),
        transactionHash,
        transactionType: event.name,
      })
      .toPromise();
  }

  public parseErc721Template(contractTemplate: string): {
    contractFeatures: Array<ContractFeatures>;
    contractModule: ModuleType;
  } {
    switch (Object.values(Erc721ContractTemplates)[Number(contractTemplate)]) {
      case Erc721ContractTemplates.RAFFLE:
        return { contractFeatures: [], contractModule: ModuleType.RAFFLE };
      case Erc721ContractTemplates.LOTTERY:
        return { contractFeatures: [], contractModule: ModuleType.LOTTERY };
      case Erc721ContractTemplates.SIMPLE:
        return { contractFeatures: [], contractModule: ModuleType.HIERARCHY };
      default:
        return {
          contractFeatures:
            contractTemplate === "0" || ""
              ? []
              : (Object.values(Erc721ContractTemplates)[Number(contractTemplate)].split(
                  "_",
                ) as Array<ContractFeatures>),
          contractModule: ModuleType.HIERARCHY,
        };
    }
  }

  public async getMerchantId(userId: number): Promise<number> {
    const userEntity = await this.userService.findOne({ id: userId });
    if (!userEntity) {
      this.loggerService.error("CRITICAL ERROR", ContractManagerErc721ServiceEth.name);
      throw new NotFoundException("userNotFound");
    }
    return userEntity.merchantId;
  }

  public async getUserWalletById(userId: number): Promise<string> {
    const userEntity = await this.userService.findOne({ id: userId });
    if (!userEntity) {
      this.loggerService.error("CRITICAL ERROR", ContractManagerErc721ServiceEth.name);
      throw new NotFoundException("userNotFound");
    }
    return userEntity.wallet;
  }
}
