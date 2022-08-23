import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import { IReward, IWithdraw, ReferralProgramEventType, TReferralEventData } from "@framework/types";

import { ReferralHistoryService } from "./history/history.service";
import { ReferralService } from "./referral.service";
import { ContractService } from "../../hierarchy/contract/contract.service";

@Injectable()
export class ReferralServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly referralService: ReferralService,
    private readonly referralHistoryService: ReferralHistoryService,
    private readonly contractService: ContractService,
  ) {}

  public async reward(event: ILogEvent<IReward>, context: Log): Promise<void> {
    await this.updateHistory(event, context);

    const { args } = event;

    await this.referralService.create(args);
  }

  public async withdraw(event: ILogEvent<IWithdraw>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
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

    await this.contractService.updateLastBlockByAddr(
      address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
