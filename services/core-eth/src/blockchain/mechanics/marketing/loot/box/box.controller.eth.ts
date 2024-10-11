import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IERC721TokenTransferEvent, IUnpackLootBoxEvent } from "@framework/types";
import { Erc721EventType, LootEventType } from "@framework/types";

import { LootBoxServiceEth } from "./box.service.eth";
import { ContractType } from "../../../../../utils/contract-type";

@Controller()
export class LootBoxControllerEth {
  constructor(private readonly lootBoxServiceEth: LootBoxServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: Erc721EventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IERC721TokenTransferEvent>, @Ctx() context: Log): Promise<void> {
    return this.lootBoxServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.LOOT, eventName: LootEventType.UnpackLootBox })
  public unpackItem(@Payload() event: ILogEvent<IUnpackLootBoxEvent>, @Ctx() context: Log): Promise<void> {
    return this.lootBoxServiceEth.unpack(event, context);
  }
}
