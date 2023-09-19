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
  IUnpackMysteryBoxEvent,
} from "@framework/types";

import { MysteryBoxServiceEth } from "./box.service.eth";

@Controller()
export class MysteryBoxControllerEth {
  constructor(private readonly mysteryBoxServiceEth: MysteryBoxServiceEth) {}

  @EventPattern({ contractType: ContractType.MYSTERY, eventName: ContractEventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IERC721TokenTransferEvent>, @Ctx() context: Log): Promise<void> {
    return this.mysteryBoxServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.MYSTERY, eventName: ContractEventType.Approval })
  public approval(@Payload() event: ILogEvent<IERC721TokenApproveEvent>, @Ctx() context: Log): Promise<void> {
    return this.mysteryBoxServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.MYSTERY, eventName: ContractEventType.ApprovalForAll })
  public approvalForAll(
    @Payload() event: ILogEvent<IERC721TokenApprovedForAllEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.mysteryBoxServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.MYSTERY, eventName: ContractEventType.UnpackMysteryBox })
  public unpackItem(@Payload() event: ILogEvent<IUnpackMysteryBoxEvent>, @Ctx() context: Log): Promise<void> {
    return this.mysteryBoxServiceEth.unpack(event, context);
  }
}
