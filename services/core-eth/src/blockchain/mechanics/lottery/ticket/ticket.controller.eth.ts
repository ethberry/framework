import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractEventType,
  ContractType,
  IERC721TokenApprovedForAllEvent,
  IERC721TokenApproveEvent,
  IERC721TokenTransferEvent,
  ILotteryPurchaseEvent,
  LotteryEventType,
} from "@framework/types";

import { LotteryTicketServiceEth } from "./ticket.service.eth";
import { TokenServiceEth } from "../../../hierarchy/token/token.service.eth";

@Controller()
export class LotteryTicketControllerEth {
  constructor(
    private readonly ticketServiceEth: LotteryTicketServiceEth,
    private readonly tokenServiceEth: TokenServiceEth,
  ) {}

  @EventPattern({ contractType: ContractType.LOTTERY, eventName: LotteryEventType.Purchase })
  public purchase(@Payload() event: ILogEvent<ILotteryPurchaseEvent>, @Ctx() context: Log): Promise<void> {
    return this.ticketServiceEth.purchase(event, context);
  }

  @EventPattern({ contractType: ContractType.LOTTERY, eventName: ContractEventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IERC721TokenTransferEvent>, @Ctx() context: Log): Promise<void> {
    return this.ticketServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.LOTTERY, eventName: ContractEventType.Approval })
  public approval(@Payload() event: ILogEvent<IERC721TokenApproveEvent>, @Ctx() context: Log): Promise<void> {
    return this.tokenServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.LOTTERY, eventName: ContractEventType.ApprovalForAll })
  public approvalForAll(
    @Payload() event: ILogEvent<IERC721TokenApprovedForAllEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.tokenServiceEth.approvalForAll(event, context);
  }
}
