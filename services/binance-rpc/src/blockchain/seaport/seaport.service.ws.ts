import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IEvent } from "@gemunion/nestjs-web3";

import { SeaportHistoryService } from "../seaport-history/seaport-history.service";
import { SeaportEventType, ISeaportOrderFulfilled, TSeaportEventData } from "../seaport-history/interfaces";

@Injectable()
export class SeaportServiceWs {
  private chainId: number;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly seaportHistoryService: SeaportHistoryService,
  ) {
    this.chainId = ~~configService.get<string>("CHAIN_ID", "1337");
  }

  public async orderFulfilled(event: IEvent<ISeaportOrderFulfilled>): Promise<void> {
    await this.updateHistory(event);
  }

  public async orderCancelled(event: IEvent<ISeaportOrderFulfilled>): Promise<void> {
    await this.updateHistory(event);
  }

  public async orderValidated(event: IEvent<ISeaportOrderFulfilled>): Promise<void> {
    await this.updateHistory(event);
  }

  public async nonceIncremented(event: IEvent<ISeaportOrderFulfilled>): Promise<void> {
    await this.updateHistory(event);
  }

  private async updateHistory(event: IEvent<TSeaportEventData>) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), SeaportServiceWs.name);

    const { returnValues, event: eventType, transactionHash, address } = event;

    await this.seaportHistoryService.create({
      address,
      transactionHash,
      eventType: eventType as SeaportEventType,
      eventData: returnValues,
    });
  }
}
