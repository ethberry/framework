import { Body, Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";

import { SignalEventType } from "@framework/types";

@Controller()
export class EventControllerRmq {
  @EventPattern(SignalEventType.TRANSACTION_HASH)
  public sendMessage(@Body() dto: { transactionHash: string }): void {
    void dto;
    // send to socket
  }
}
