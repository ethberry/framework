import { Injectable } from "@nestjs/common";

import { SignalEventType } from "@framework/types";

import { EventGateway } from "./event.gateway";
import type { ISignalMessageDto } from "./interfaces";

@Injectable()
export class EventService {
  constructor(private readonly eventGateway: EventGateway) {}

  public sendMessage(dto: ISignalMessageDto): void {
    const { account, transactionHash } = dto;
    console.log("sendMessage", dto);
    console.log("0xfe3b557e8fb62b89f4916b721be55ceb828dbd73");
    console.log(account);
    this.eventGateway.server
      .to("0xfe3b557e8fb62b89f4916b721be55ceb828dbd73")
      .emit(SignalEventType.TRANSACTION_HASH, { transactionHash });
  }
}
