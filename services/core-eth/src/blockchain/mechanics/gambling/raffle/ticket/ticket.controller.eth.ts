import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import {
  ContractType,
  Erc721EventType,
  IERC721TokenApprovedForAllEvent,
  IERC721TokenApproveEvent,
  IERC721TokenTransferEvent,
} from "@framework/types";

import { TokenServiceEth } from "../../../../hierarchy/token/token.service.eth";
import { RaffleTicketServiceEth } from "./ticket.service.eth";

@Controller()
export class RaffleTicketControllerEth {
  constructor(
    private readonly ticketServiceEth: RaffleTicketServiceEth,
    private readonly tokenServiceEth: TokenServiceEth,
  ) {}

  @EventPattern({ contractType: ContractType.RAFFLE, eventName: Erc721EventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IERC721TokenTransferEvent>, @Ctx() context: Log): Promise<void> {
    return this.ticketServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.RAFFLE, eventName: Erc721EventType.Approval })
  public approval(@Payload() event: ILogEvent<IERC721TokenApproveEvent>, @Ctx() context: Log): Promise<void> {
    return this.tokenServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.RAFFLE, eventName: Erc721EventType.ApprovalForAll })
  public approvalForAll(
    @Payload() event: ILogEvent<IERC721TokenApprovedForAllEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.tokenServiceEth.approvalForAll(event, context);
  }
}
