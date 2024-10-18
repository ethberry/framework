import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";

import { emptyStateString } from "@ethberry/draft-js-utils";
import { imageUrl, testChainId } from "@framework/constants";
import type { IContractManagerERC20TokenDeployedEvent } from "@framework/types";
import {
  ContractFeatures,
  Erc20ContractTemplates,
  RmqProviderType,
  SignalEventType,
  TokenType,
} from "@framework/types";

import { UserService } from "../../../infrastructure/user/user.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { TemplateService } from "../../hierarchy/template/template.service";
import { TokenService } from "../../hierarchy/token/token.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { ContractManagerServiceEth } from "../cm.service";

@Injectable()
export class ContractManagerErc20ServiceEth extends ContractManagerServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    protected readonly configService: ConfigService,
    protected readonly eventHistoryService: EventHistoryService,
    protected readonly contractService: ContractService,
    protected readonly templateService: TemplateService,
    protected readonly tokenService: TokenService,
    protected readonly userService: UserService,
  ) {
    super(loggerService, userService);
  }

  public async deploy(event: ILogEvent<IContractManagerERC20TokenDeployedEvent>, context: Log): Promise<void> {
    const {
      args: { account, args, externalId },
    } = event;
    const { transactionHash } = context;

    const { name, symbol, cap, contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, context);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const contractEntity = await this.contractService.create({
      address: account.toLowerCase(),
      title: name,
      name,
      symbol,
      decimals: 18,
      description: emptyStateString,
      imageUrl,
      contractFeatures:
        contractTemplate === "0"
          ? []
          : (Object.values(Erc20ContractTemplates)[Number(contractTemplate)].split("_") as Array<ContractFeatures>),
      contractType: TokenType.ERC20,
      chainId,
      fromBlock: parseInt(context.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    const templateEntity = await this.templateService.create({
      title: name,
      description: emptyStateString,
      imageUrl,
      cap,
      amount: cap,
      contractId: contractEntity.id,
    });

    await this.tokenService.create({
      metadata: "{}",
      tokenId: "0",
      royalty: 0,
      template: templateEntity,
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
