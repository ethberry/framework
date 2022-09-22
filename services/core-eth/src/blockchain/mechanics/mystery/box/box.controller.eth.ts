import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractEventType,
  ContractType,
  IERC721TokenApprovedForAllEvent,
  IERC721TokenApproveEvent,
  IERC721TokenTransferEvent,
  IMysteryUnpackEvent,
} from "@framework/types";

import { MysteryBoxServiceEth } from "./box.service.eth";

@Controller()
export class MysteryBoxControllerEth {
  constructor(private readonly mysteryboxServiceEth: MysteryBoxServiceEth) {}

  @EventPattern({ contractType: ContractType.MYSTERY, eventName: ContractEventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IERC721TokenTransferEvent>, @Ctx() context: Log): Promise<void> {
    return this.mysteryboxServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.MYSTERY, eventName: ContractEventType.Approval })
  public approval(@Payload() event: ILogEvent<IERC721TokenApproveEvent>, @Ctx() context: Log): Promise<void> {
    return this.mysteryboxServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.MYSTERY, eventName: ContractEventType.ApprovalForAll })
  public approvalForAll(
    @Payload() event: ILogEvent<IERC721TokenApprovedForAllEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.mysteryboxServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.MYSTERY, eventName: ContractEventType.UnpackMysterybox })
  public unpackItem(@Payload() event: ILogEvent<IMysteryUnpackEvent>, @Ctx() context: Log): Promise<void> {
    return this.mysteryboxServiceEth.unpack(event, context);
  }
}
