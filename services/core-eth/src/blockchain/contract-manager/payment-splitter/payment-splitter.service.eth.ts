import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { JsonRpcProvider, Log, Wallet } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { ETHERS_RPC, ETHERS_SIGNER } from "@ethberry/nest-js-module-ethers-gcp";

import { emptyStateString } from "@ethberry/draft-js-utils";
import { imageUrl, testChainId } from "@framework/constants";
import type { IContractManagerPaymentSplitterDeployedEvent } from "@framework/types";
import { ContractStatus, ModuleType, RmqProviderType, SignalEventType } from "@framework/types";

import { UserService } from "../../../infrastructure/user/user.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { ContractManagerServiceEth } from "../cm.service";

@Injectable()
export class ContractManagerPaymentSplitterServiceEth extends ContractManagerServiceEth {
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

  public async deploy(event: ILogEvent<IContractManagerPaymentSplitterDeployedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { account, externalId, args },
    } = event;
    const { transactionHash } = context;

    const { payees, shares } = args;

    await this.eventHistoryService.updateHistory(event, context);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    await this.contractService.create({
      address: account.toLowerCase(),
      title: `${ModuleType.PAYMENT_SPLITTER} (new)`,
      description: emptyStateString,
      parameters: {
        payees: payees.map(payee => payee.toLowerCase()),
        shares: shares.map(share => Number(share)),
      },
      imageUrl,
      contractFeatures: [],
      contractStatus: ContractStatus.ACTIVE,
      contractModule: ModuleType.PAYMENT_SPLITTER,
      chainId,
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
