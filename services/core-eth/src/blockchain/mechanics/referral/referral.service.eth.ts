import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IReferralRewardEvent, IReferralWithdrawEvent } from "@framework/types";
import { testChainId } from "@framework/constants";
import { ReferralService } from "./referral.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { EventHistoryService } from "../../event-history/event-history.service";

@Injectable()
export class ReferralServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly referralService: ReferralService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly contractService: ContractService,
  ) {}

  public async reward(event: ILogEvent<IReferralRewardEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);

    const { args } = event;
    const { token } = args;

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const contractEntity = await this.contractService.findOne({ chainId, address: token });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.referralService.create({ contractId: contractEntity.id, ...args });
  }

  public async withdraw(event: ILogEvent<IReferralWithdrawEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }
}
