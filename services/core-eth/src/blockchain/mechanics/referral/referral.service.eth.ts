import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import { IReward, ReferralProgramEventType, TReferralEventData } from "@framework/types";

import { ContractManagerService } from "../../contract-manager/contract-manager.service";
import { ReferralHistoryService } from "./history/ref-history.service";
import { ReferralService } from "./referral.service";

@Injectable()
export class ReferralServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly referralService: ReferralService,
    private readonly referralHistoryService: ReferralHistoryService,
    private readonly contractManagerService: ContractManagerService,
  ) {}

  public async reward(event: ILogEvent<IReward>, context: Log): Promise<void> {
    await this.updateHistory(event, context);

    const { args } = event;

    await this.referralService.create(args);
  }

  private async updateHistory(event: ILogEvent<TReferralEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), ReferralServiceEth.name);

    const { args, name } = event;

    const { transactionHash, address, blockNumber } = context;

    await this.referralHistoryService.create({
      address,
      transactionHash,
      eventType: name as ReferralProgramEventType,
      eventData: args,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
