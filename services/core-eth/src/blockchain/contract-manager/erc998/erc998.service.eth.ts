import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { JsonRpcProvider, Log, Wallet } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { ETHERS_RPC, ETHERS_SIGNER } from "@ethberry/nest-js-module-ethers-gcp";

import { emptyStateString } from "@ethberry/draft-js-utils";
import { imageUrl, testChainId } from "@framework/constants";
import type { IContractManagerERC998TokenDeployedEvent } from "@framework/types";
import {
  ContractFeatures,
  Erc998ContractTemplates,
  RmqProviderType,
  SignalEventType,
  TemplateStatus,
  TokenType,
} from "@framework/types";

import { UserService } from "../../../infrastructure/user/user.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { TemplateService } from "../../hierarchy/template/template.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { Erc998TokenServiceLog } from "../../tokens/erc998/token/token.service.log";

@Injectable()
export class ContractManagerServiceEth {
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
    private readonly erc998TokenService: Erc998TokenServiceLog,
  ) {}

  public async erc998Token(event: ILogEvent<IContractManagerERC998TokenDeployedEvent>, context: Log): Promise<void> {
    const {
      args: { account, args, externalId },
    } = event;
    const { transactionHash } = context;

    const { name, symbol, royalty, baseTokenURI, contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, context);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const contractEntity = await this.contractService.create({
      address: account.toLowerCase(),
      title: name,
      name,
      symbol,
      description: emptyStateString,
      imageUrl,
      contractFeatures:
        contractTemplate === "0"
          ? []
          : (Object.values(Erc998ContractTemplates)[Number(contractTemplate)].split("_") as Array<ContractFeatures>),
      contractType: TokenType.ERC998,
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

    this.erc998TokenService.updateRegistry([account]);

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
      this.loggerService.error("CRITICAL ERROR", ContractManagerServiceEth.name);
      throw new NotFoundException("userNotFound");
    }
    return userEntity.merchantId;
  }

  public async getUserWalletById(userId: number): Promise<string> {
    const userEntity = await this.userService.findOne({ id: userId });
    if (!userEntity) {
      this.loggerService.error("CRITICAL ERROR", ContractManagerServiceEth.name);
      throw new NotFoundException("userNotFound");
    }
    return userEntity.wallet;
  }
}
