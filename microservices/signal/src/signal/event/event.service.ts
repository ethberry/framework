import { Injectable } from "@nestjs/common";

import { SignalEventType } from "@framework/types";

import { EventGateway } from "./event.gateway";
import type { ISignalMessageDto } from "./interfaces";

@Injectable()
export class EventService {
  constructor(private readonly eventGateway: EventGateway) {}

  public sendMessage(dto: ISignalMessageDto): void {
    const { account, transactionHash, transactionType } = dto;
    console.info("sendMessage to", account, dto);
    this.eventGateway.server.to(account).emit(SignalEventType.TRANSACTION_HASH, { transactionHash, transactionType });
  }
}
