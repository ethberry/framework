import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IBlacklistedEvent,
  IContractManagerCommonDeployedEvent,
  IUnBlacklistedEvent,
  IUnWhitelistedEvent,
  IWhitelistedEvent,
} from "@framework/types";
import { RmqProviderType, SignalEventType } from "@framework/types";

import { AccessListService } from "./access-list.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { AccessListServiceLog } from "./access-list.service.log";

@Injectable()
export class AccessListServiceEth {
  constructor(
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly accessListService: AccessListService,
    private readonly contractService: ContractService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly accessListServiceLog: AccessListServiceLog,
  ) {}

  public async blacklisted(event: ILogEvent<IBlacklistedEvent>, context: Log): Promise<void> {
    const {
      args: { account },
    } = event;

    const { address, transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);

    await this.accessListService.create({
      address: context.address.toLowerCase(),
      account: account.toLowerCase(),
      allowance: false,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.contractService.getMerchantWalletByContract(address.toLowerCase()),
        transactionHash,
        transactionType: event.name,
      })
      .toPromise();
  }

  public async unBlacklisted(event: ILogEvent<IUnBlacklistedEvent>, context: Log): Promise<void> {
    const {
      args: { account },
    } = event;

    const { address, transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);

    await this.accessListService.remove({
      address: context.address.toLowerCase(),
      account: account.toLowerCase(),
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.contractService.getMerchantWalletByContract(address.toLowerCase()),
        transactionHash,
        transactionType: event.name,
      })
      .toPromise();
  }

  public async whitelisted(event: ILogEvent<IWhitelistedEvent>, context: Log): Promise<void> {
    const {
      args: { account },
    } = event;
    const { address, transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);

    await this.accessListService.create({
      address: context.address.toLowerCase(),
      account: account.toLowerCase(),
      allowance: true,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.contractService.getMerchantWalletByContract(address.toLowerCase()),
        transactionHash,
        transactionType: event.name,
      })
      .toPromise();
  }

  public async unWhitelisted(event: ILogEvent<IUnWhitelistedEvent>, context: Log): Promise<void> {
    const {
      args: { account },
    } = event;
    const { address, transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);

    await this.accessListService.remove({
      address: context.address.toLowerCase(),
      account: account.toLowerCase(),
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.contractService.getMerchantWalletByContract(address.toLowerCase()),
        transactionHash,
        transactionType: event.name,
      })
      .toPromise();
  }

  public deploy(event: ILogEvent<IContractManagerCommonDeployedEvent>): void {
    const {
      args: { account },
    } = event;

    this.accessListServiceLog.updateRegistry([account]);
  }
}
