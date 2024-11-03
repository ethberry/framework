import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import {
  IContractManagerVestingTokenDeployedEvent,
  IVestingERC20ReleasedEvent,
  RmqProviderType,
  SignalEventType
} from "@framework/types";
import { testChainId } from "@framework/constants";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { NotificatorService } from "../../../../game/notificator/notificator.service";
import { VestingBoxServiceLog } from "./vesting.service.log";

@Injectable()
export class VestingServiceEth {
  constructor(
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly eventHistoryService: EventHistoryService,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
    private readonly notificatorService: NotificatorService,
    protected readonly vestingBoxServiceLog: VestingBoxServiceLog,

  ) {}

  public async erc20Released(event: ILogEvent<IVestingERC20ReleasedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { token, amount },
    } = event;
    const { transactionHash, address } = context;

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const vestingEntity = await this.contractService.findOne(
      { address: address.toLowerCase(), chainId },
      { relations: { merchant: true } },
    );

    if (!vestingEntity) {
      throw new NotFoundException("vestingNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context);

    const contractEntity = await this.contractService.findOne({ address: token.toLowerCase(), chainId });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.notificatorService.vestingRelease({
      vesting: vestingEntity,
      token: contractEntity,
      amount,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: vestingEntity.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public deploy(event: ILogEvent<IContractManagerVestingTokenDeployedEvent>): void {
    const {
      args: { account },
    } = event;

    this.vestingBoxServiceLog.updateRegistry([account]);
  }
}
