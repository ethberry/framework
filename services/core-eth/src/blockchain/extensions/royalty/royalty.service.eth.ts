import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IContractManagerCommonDeployedEvent,
  IDefaultRoyaltyInfoEvent,
  ITokenRoyaltyInfoEvent,
} from "@framework/types";
import { RmqProviderType, SignalEventType } from "@framework/types";

import { ContractService } from "../../hierarchy/contract/contract.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { RoyaltyServiceLog } from "./royalty.service.log";
import { TokenService } from "../../hierarchy/token/token.service";

@Injectable()
export class RoyaltyServiceEth {
  constructor(
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly contractService: ContractService,
    private readonly tokenService: TokenService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly royaltyServiceLog: RoyaltyServiceLog,
  ) {}

  public async defaultRoyaltyInfo(event: ILogEvent<IDefaultRoyaltyInfoEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { royaltyNumerator },
    } = event;
    const { address, transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);

    const contractEntity = await this.contractService.findOne(
      { address: address.toLowerCase() },
      { relations: { merchant: true } },
    );

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    contractEntity.royalty = Number(royaltyNumerator);

    await contractEntity.save();

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: contractEntity.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async tokenRoyaltyInfo(event: ILogEvent<ITokenRoyaltyInfoEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { tokenId, royaltyNumerator },
    } = event;
    const { address, transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);

    const contractEntity = await this.contractService.findOne(
      { address: address.toLowerCase() },
      { relations: { merchant: true } },
    );

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const tokenEntity = await this.tokenService.getToken(tokenId, address.toLowerCase());

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    tokenEntity.royalty = Number(royaltyNumerator);

    await tokenEntity.save();

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: contractEntity.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public deploy(event: ILogEvent<IContractManagerCommonDeployedEvent>): void {
    const {
      args: { account },
    } = event;

    this.royaltyServiceLog.updateRegistry([account]);
  }
}
