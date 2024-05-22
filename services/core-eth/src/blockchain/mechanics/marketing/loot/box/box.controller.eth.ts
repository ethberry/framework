import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import {
  ContractEventType,
  ContractType,
  IERC721TokenApprovedForAllEvent,
  IERC721TokenApproveEvent,
  IERC721TokenTransferEvent,
  IUnpackLootBoxEvent,
} from "@framework/types";

import { LootBoxServiceEth } from "./box.service.eth";

@Controller()
export class LootBoxControllerEth {
  constructor(private readonly lootBoxServiceEth: LootBoxServiceEth) {}

  @EventPattern({ contractType: ContractType.LOOT, eventName: ContractEventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IERC721TokenTransferEvent>, @Ctx() context: Log): Promise<void> {
    return this.lootBoxServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.LOOT, eventName: ContractEventType.Approval })
  public approval(@Payload() event: ILogEvent<IERC721TokenApproveEvent>, @Ctx() context: Log): Promise<void> {
    return this.lootBoxServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.LOOT, eventName: ContractEventType.ApprovalForAll })
  public approvalForAll(
    @Payload() event: ILogEvent<IERC721TokenApprovedForAllEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.lootBoxServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.LOOT, eventName: ContractEventType.UnpackLootBox })
  public unpackItem(@Payload() event: ILogEvent<IUnpackLootBoxEvent>, @Ctx() context: Log): Promise<void> {
    return this.lootBoxServiceEth.unpack(event, context);
  }
}
