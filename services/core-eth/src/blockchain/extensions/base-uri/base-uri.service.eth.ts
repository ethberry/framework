import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { IBaseURIUpdateEvent, RmqProviderType, SignalEventType, ModuleType } from "@framework/types";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { TokenService } from "../../hierarchy/token/token.service";

@Injectable()
export class BaseUriServiceEth {
  constructor(
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly contractService: ContractService,
    private readonly tokenService: TokenService,
    private readonly eventHistoryService: EventHistoryService,
  ) {}

  public async updateBaseUri(event: ILogEvent<IBaseURIUpdateEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { baseTokenURI },
    } = event;
    const { address, transactionHash } = context;

    const contractEntity = await this.contractService.findOne(
      {
        address: address.toLowerCase(),
      },
      { relations: { merchant: true } },
    );

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    contractEntity.baseTokenURI = baseTokenURI.toLowerCase();

    await contractEntity.save();

    if (contractEntity.contractModule === ModuleType.COLLECTION) {
      // UPDATE ALL COLLECTION TOKENS
      await this.tokenService.updateBatchURI(contractEntity.id, contractEntity.address, baseTokenURI.toLowerCase());
    }

    await this.eventHistoryService.updateHistory(event, context);

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: contractEntity.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }
}
