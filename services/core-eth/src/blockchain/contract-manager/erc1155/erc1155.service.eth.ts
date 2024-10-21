import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { JsonRpcProvider, Log, Wallet } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { ETHERS_RPC, ETHERS_SIGNER } from "@ethberry/nest-js-module-ethers-gcp";

import { emptyStateString } from "@ethberry/draft-js-utils";
import { imageUrl, testChainId } from "@framework/constants";
import {
  ContractFeatures,
  Erc1155ContractTemplates,
  IContractManagerERC1155TokenDeployedEvent,
  RmqProviderType,
  SignalEventType,
  TokenType,
} from "@framework/types";

import { UserService } from "../../../infrastructure/user/user.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { ContractManagerServiceEth } from "../cm.service";

@Injectable()
export class ContractManagerErc1155ServiceEth extends ContractManagerServiceEth {
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
    protected readonly userService: UserService,
  ) {
    super(loggerService, userService);
  }

  public async deploy(event: ILogEvent<IContractManagerERC1155TokenDeployedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { account, args, externalId },
    } = event;
    const { transactionHash } = context;

    const { royalty, baseTokenURI, contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, context);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const contractFeatures =
      contractTemplate === "0"
        ? []
        : (Object.values(Erc1155ContractTemplates)[Number(contractTemplate)].split("_") as Array<ContractFeatures>);

    await this.contractService.create({
      address: account.toLowerCase(),
      title: `${TokenType.ERC1155} (new)`,
      description: emptyStateString,
      imageUrl,
      baseTokenURI,
      contractFeatures,
      contractType: TokenType.ERC1155,
      chainId,
      royalty: Number(royalty),
      fromBlock: parseInt(context.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.getUserWalletById(externalId),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }
}
