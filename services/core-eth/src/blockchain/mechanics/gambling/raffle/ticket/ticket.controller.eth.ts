import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IERC721TokenTransferEvent } from "@framework/types";
import { Erc721EventType } from "@framework/types";
import { RaffleTicketServiceEth } from "./ticket.service.eth";
import { ContractType } from "../../../../../utils/contract-type";

@Controller()
export class RaffleTicketControllerEth {
  constructor(private readonly ticketServiceEth: RaffleTicketServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: Erc721EventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IERC721TokenTransferEvent>, @Ctx() context: Log): Promise<void> {
    return this.ticketServiceEth.transfer(event, context);
  }
}
