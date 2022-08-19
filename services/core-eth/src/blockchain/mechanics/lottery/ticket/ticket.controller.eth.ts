import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractType, IVestingERC20Released, VestingEventType } from "@framework/types";

import { LotteryTicketServiceEth } from "./ticket.service.eth";

@Controller()
export class LotteryTicketControllerEth {
  constructor(private readonly ticketServiceEth: LotteryTicketServiceEth) {}

  @EventPattern({ contractType: ContractType.LOTTERY, eventName: VestingEventType.ERC20Released })
  public erc20Released(@Payload() event: ILogEvent<IVestingERC20Released>, @Ctx() context: Log): Promise<void> {
    return this.ticketServiceEth.purchase(event, context);
  }
}
