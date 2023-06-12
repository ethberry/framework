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
  IRafflePurchaseEvent,
  RaffleEventType,
} from "@framework/types";

import { RaffleTicketServiceEth } from "./ticket.service.eth";
import { TokenServiceEth } from "../../../hierarchy/token/token.service.eth";

@Controller()
export class RaffleTicketControllerEth {
  constructor(
    private readonly ticketServiceEth: RaffleTicketServiceEth,
    private readonly tokenServiceEth: TokenServiceEth,
  ) {}

  @EventPattern({ contractType: ContractType.RAFFLE, eventName: RaffleEventType.PurchaseRaffle })
  public purchase(@Payload() event: ILogEvent<IRafflePurchaseEvent>, @Ctx() context: Log): Promise<void> {
    return this.ticketServiceEth.purchase(event, context);
  }

  @EventPattern({ contractType: ContractType.RAFFLE, eventName: ContractEventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IERC721TokenTransferEvent>, @Ctx() context: Log): Promise<void> {
    return this.ticketServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.RAFFLE, eventName: ContractEventType.Approval })
  public approval(@Payload() event: ILogEvent<IERC721TokenApproveEvent>, @Ctx() context: Log): Promise<void> {
    return this.tokenServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.RAFFLE, eventName: ContractEventType.ApprovalForAll })
  public approvalForAll(
    @Payload() event: ILogEvent<IERC721TokenApprovedForAllEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.tokenServiceEth.approvalForAll(event, context);
  }
}
