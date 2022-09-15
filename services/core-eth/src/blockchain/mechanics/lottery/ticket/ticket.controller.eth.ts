import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractType, ILotteryPurchaseEvent, LotteryEventType } from "@framework/types";

import { LotteryTicketServiceEth } from "./ticket.service.eth";

@Controller()
export class LotteryTicketControllerEth {
  constructor(private readonly ticketServiceEth: LotteryTicketServiceEth) {}

  @EventPattern({ contractType: ContractType.LOTTERY, eventName: LotteryEventType.Purchase })
  public purchase(@Payload() event: ILogEvent<ILotteryPurchaseEvent>, @Ctx() context: Log): Promise<void> {
    return this.ticketServiceEth.purchase(event, context);
  }
}
