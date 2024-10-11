import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IERC721TokenTransferEvent, IUnpackMysteryBoxEvent } from "@framework/types";
import { Erc721EventType } from "@framework/types";
import { MysteryEventType } from "@framework/types";

import { ContractType } from "../../../../../utils/contract-type";
import { MysteryBoxServiceEth } from "./box.service.eth";

@Controller()
export class MysteryBoxControllerEth {
  constructor(private readonly mysteryBoxServiceEth: MysteryBoxServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: Erc721EventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IERC721TokenTransferEvent>, @Ctx() context: Log): Promise<void> {
    return this.mysteryBoxServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.MYSTERY, eventName: MysteryEventType.UnpackMysteryBox })
  public unpackItem(@Payload() event: ILogEvent<IUnpackMysteryBoxEvent>, @Ctx() context: Log): Promise<void> {
    return this.mysteryBoxServiceEth.unpack(event, context);
  }
}
