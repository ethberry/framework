import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";

import { IEvent } from "@gemunion/nestjs-web3";
import { Erc20VestingEventType, IErc20VestingFlatVestingCreated, TErc20VestingEventData } from "@framework/types";

import { Erc20VestingHistoryService } from "../vesting-history/vesting-history.service";
import { Erc20VestingService } from "./vesting.service";
import { Erc20TokenService } from "../token/token.service";

@Injectable()
export class Erc20VestingServiceWs {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly erc20VestingHistoryService: Erc20VestingHistoryService,
    private readonly erc20VestingService: Erc20VestingService,
    private readonly erc20TokenService: Erc20TokenService,
  ) {}

  public async created(event: IEvent<IErc20VestingFlatVestingCreated>): Promise<void> {
    const {
      returnValues: { token, beneficiary, amount, durationSeconds, vesting, startTimestamp },
    } = event;

    await this.updateHistory(event);

    const tokenEntity = await this.erc20TokenService.findOne({ address: token });

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.erc20VestingService.create({
      address: vesting,
      beneficiary,
      erc20TokenId: tokenEntity.id,
      amount,
      duration: ~~durationSeconds * 1000, // TODO FIXME
      startTimestamp, // TODO FIXME
    });
  }

  private async updateHistory(event: IEvent<TErc20VestingEventData>) {
    this.loggerService.log(JSON.stringify(event, null, "\t"));

    const { returnValues, event: eventType, transactionHash, address } = event;

    await this.erc20VestingHistoryService.create({
      address,
      transactionHash,
      eventType: eventType as Erc20VestingEventType,
      eventData: returnValues,
    });
  }
}
