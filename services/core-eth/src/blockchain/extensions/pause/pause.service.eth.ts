import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";

import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IPausedEvent } from "@framework/types";
import { RmqProviderType, SignalEventType } from "@framework/types";
import { testChainId } from "@framework/constants";

import { ContractService } from "../../hierarchy/contract/contract.service";
import { EventHistoryService } from "../../event-history/event-history.service";

@Injectable()
export class PauseServiceEth {
  constructor(
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
    private readonly eventHistoryService: EventHistoryService,
  ) {}

  public async pause(event: ILogEvent<IPausedEvent>, context: Log): Promise<void> {
    await this.toggle(event, context, true);
  }

  public async unpause(event: ILogEvent<IPausedEvent>, context: Log): Promise<void> {
    await this.toggle(event, context, false);
  }

  public async toggle(event: ILogEvent<IPausedEvent>, context: Log, isPaused: boolean): Promise<void> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const { name } = event;
    await this.eventHistoryService.updateHistory(event, context);

    const { address, transactionHash } = context;

    const contractEntity = await this.contractService.findOne(
      { address: address.toLowerCase(), chainId },
      { relations: { merchant: true } },
    );

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    Object.assign(contractEntity, { isPaused });
    await contractEntity.save();

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: contractEntity.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }
}
