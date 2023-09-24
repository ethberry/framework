import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import { IReferralRewardEvent, IReferralWithdrawEvent, RmqProviderType, SignalEventType } from "@framework/types";
import { testChainId } from "@framework/constants";
import { ReferralService } from "./referral.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { EventHistoryService } from "../../event-history/event-history.service";

@Injectable()
export class ReferralServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly configService: ConfigService,
    private readonly referralService: ReferralService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly contractService: ContractService,
  ) {}

  public async reward(event: ILogEvent<IReferralRewardEvent>, context: Log): Promise<void> {
    const { transactionHash } = context;
    const { name, args } = event;
    const { account, token } = args;

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const tokenContractEntity = await this.contractService.findOne({ chainId, address: token });

    if (!tokenContractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context);

    await this.referralService.create({ contractId: tokenContractEntity.id, ...args });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: account.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async withdraw(event: ILogEvent<IReferralWithdrawEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }
}
