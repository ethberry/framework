import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IERC721TokenApprovedForAllEvent,
  IERC721TokenApproveEvent,
  IERC721TokenTransferEvent,
} from "@framework/types";
import { Erc721EventType } from "@framework/types";

import { LotteryTicketServiceEth } from "./ticket.service.eth";
import { ContractType } from "../../../../../utils/contract-type";

@Controller()
export class LotteryTicketControllerEth {
  constructor(private readonly lotteryTicketServiceEth: LotteryTicketServiceEth) {}

  @EventPattern({ contractType: ContractType.LOTTERY_TICKET, eventName: Erc721EventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IERC721TokenTransferEvent>, @Ctx() context: Log): Promise<void> {
    return this.lotteryTicketServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.LOTTERY_TICKET, eventName: Erc721EventType.Approval })
  public approval(@Payload() event: ILogEvent<IERC721TokenApproveEvent>, @Ctx() context: Log): Promise<void> {
    return this.lotteryTicketServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.LOTTERY_TICKET, eventName: Erc721EventType.ApprovalForAll })
  public approvalForAll(
    @Payload() event: ILogEvent<IERC721TokenApprovedForAllEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.lotteryTicketServiceEth.approvalForAll(event, context);
  }
}
