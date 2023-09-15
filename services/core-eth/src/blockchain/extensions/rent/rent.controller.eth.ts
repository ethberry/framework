import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IErc4907UpdateUserEvent } from "@framework/types";
import { ContractType, Erc4907EventType } from "@framework/types";

import { RentServiceEth } from "./rent.service.eth";

@Controller()
export class RentControllerEth {
  constructor(private readonly rentServiceEth: RentServiceEth) {}

  @EventPattern([
    {
      contractType: ContractType.ERC721_TOKEN,
      eventName: Erc4907EventType.UpdateUser,
    },
    {
      contractType: ContractType.ERC721_TOKEN_RANDOM,
      eventName: Erc4907EventType.UpdateUser,
    },
    {
      contractType: ContractType.ERC998_TOKEN,
      eventName: Erc4907EventType.UpdateUser,
    },
    {
      contractType: ContractType.ERC998_TOKEN_RANDOM,
      eventName: Erc4907EventType.UpdateUser,
    },
  ])
  public updateUser(@Payload() event: ILogEvent<IErc4907UpdateUserEvent>, @Ctx() context: Log): Promise<void> {
    return this.rentServiceEth.updateUser(event, context);
  }
}
