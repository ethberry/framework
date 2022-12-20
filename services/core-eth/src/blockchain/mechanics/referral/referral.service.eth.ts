import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  IReferralRewardEvent,
  IReferralWithdrawEvent,
  ReferralProgramEventType,
  TReferralEventData,
} from "@framework/types";
import { testChainId } from "@framework/constants";

import { ReferralHistoryService } from "./history/history.service";
import { ReferralService } from "./referral.service";
import { ContractService } from "../../hierarchy/contract/contract.service";

@Injectable()
export class ReferralServiceEth {
  private chainId: number;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly referralService: ReferralService,
    private readonly referralHistoryService: ReferralHistoryService,
    private readonly contractService: ContractService,
  ) {
    this.chainId = ~~configService.get<number>("CHAIN_ID", testChainId);
  }

  public async reward(event: ILogEvent<IReferralRewardEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);

    const { args } = event;
    const { token } = args;

    const contractEntity = await this.contractService.findOne({ chainId: this.chainId, address: token });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.referralService.create({ contractId: contractEntity.id, ...args });
  }

  public async withdraw(event: ILogEvent<IReferralWithdrawEvent>, context: Log): Promise<void> {
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

    await this.contractService.updateLastBlockByAddr(address.toLowerCase(), parseInt(blockNumber.toString(), 16));
  }
}
