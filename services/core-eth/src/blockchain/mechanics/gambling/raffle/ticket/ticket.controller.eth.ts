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

import { RaffleTicketServiceEth } from "./ticket.service.eth";
import { ContractType } from "../../../../../utils/contract-type";

@Controller()
export class RaffleTicketControllerEth {
  constructor(private readonly raffleTicketServiceEth: RaffleTicketServiceEth) {}

  @EventPattern({ contractType: ContractType.RAFFLE_TICKET, eventName: Erc721EventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IERC721TokenTransferEvent>, @Ctx() context: Log): Promise<void> {
    return this.raffleTicketServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.RAFFLE_TICKET, eventName: Erc721EventType.Approval })
  public approval(@Payload() event: ILogEvent<IERC721TokenApproveEvent>, @Ctx() context: Log): Promise<void> {
    return this.raffleTicketServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.RAFFLE_TICKET, eventName: Erc721EventType.ApprovalForAll })
  public approvalForAll(
    @Payload() event: ILogEvent<IERC721TokenApprovedForAllEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.raffleTicketServiceEth.approvalForAll(event, context);
  }
}
