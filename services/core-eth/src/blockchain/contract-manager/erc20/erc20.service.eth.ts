import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
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
import { Erc20TokenServiceLog } from "../../tokens/erc20/token/token.service.log";

@Injectable()
export class ContractManagerErc20ServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly configService: ConfigService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly contractService: ContractService,
    private readonly templateService: TemplateService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly erc20TokenServiceLog: Erc20TokenServiceLog,
  ) {}

  public async erc20Token(event: ILogEvent<IContractManagerERC20TokenDeployedEvent>, context: Log): Promise<void> {
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
      tokenId: 0n,
      royalty: 0,
      template: templateEntity,
    });

    this.erc20TokenServiceLog.updateRegistry([account]);

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.getUserWalletById(externalId),
        transactionHash,
        transactionType: event.name,
      })
      .toPromise();
  }

  public async getMerchantId(userId: number): Promise<number> {
    const userEntity = await this.userService.findOne({ id: userId });
    if (!userEntity) {
      this.loggerService.error("CRITICAL ERROR", ContractManagerErc20ServiceEth.name);
      throw new NotFoundException("userNotFound");
    }
    return userEntity.merchantId;
  }

  public async getUserWalletById(userId: number): Promise<string> {
    const userEntity = await this.userService.findOne({ id: userId });
    if (!userEntity) {
      this.loggerService.error("CRITICAL ERROR", ContractManagerErc20ServiceEth.name);
      throw new NotFoundException("userNotFound");
    }
    return userEntity.wallet;
  }
}
