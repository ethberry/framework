import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";

import { SeaportHistoryService } from "./seaport-history/seaport-history.service";
import {
  ISeaportOrderFulfilled,
  ISeaportOrderValidated,
  ISeaportNonceIncremented,
  ISeaportOrderCancelled,
  SeaportEventType,
  TSeaportEventData,
} from "./seaport-history/interfaces";

@Injectable()
export class SeaportServiceEth {
  private chainId: number;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly seaportHistoryService: SeaportHistoryService,
  ) {
    this.chainId = ~~configService.get<string>("CHAIN_ID", "1337");
  }

  public async orderFulfilled(event: ILogEvent<ISeaportOrderFulfilled>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async orderCancelled(event: ILogEvent<ISeaportOrderCancelled>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async orderValidated(event: ILogEvent<ISeaportOrderValidated>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async nonceIncremented(event: ILogEvent<ISeaportNonceIncremented>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TSeaportEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), SeaportServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address } = context;

    await this.seaportHistoryService.create({
      address,
      transactionHash,
      eventType: name as SeaportEventType,
      eventData: args,
    });
  }
}
