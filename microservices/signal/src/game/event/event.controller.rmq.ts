import { Body, Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";

import { SignalEventType } from "@framework/types";

// https://stackoverflow.com/questions/4647348/send-message-to-specific-client-with-socket-io-and-node-js
@Controller()
export class EventControllerRmq {
  @EventPattern(SignalEventType.TRANSACTION_HASH)
  public sendMessage(@Body() dto: { transactionHash: string }): void {
    void dto;
    // send to socket
  }
}
