import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractEventType,
  ContractType,
  IMysteryboxUnpack,
  ITokenApprove,
  ITokenApprovedForAll,
  ITokenTransfer,
} from "@framework/types";

import { MysteryboxBoxServiceEth } from "./box.service.eth";

@Controller()
export class MysteryboxBoxControllerEth {
  constructor(private readonly mysteryboxServiceEth: MysteryboxBoxServiceEth) {}

  @EventPattern({ contractType: ContractType.MYSTERYBOX, eventName: ContractEventType.Transfer })
  public transfer(@Payload() event: ILogEvent<ITokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.mysteryboxServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.MYSTERYBOX, eventName: ContractEventType.Approval })
  public approval(@Payload() event: ILogEvent<ITokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.mysteryboxServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.MYSTERYBOX, eventName: ContractEventType.ApprovalForAll })
  public approvalForAll(@Payload() event: ILogEvent<ITokenApprovedForAll>, @Ctx() context: Log): Promise<void> {
    return this.mysteryboxServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.MYSTERYBOX, eventName: ContractEventType.UnpackMysterybox })
  public unpackItem(@Payload() event: ILogEvent<IMysteryboxUnpack>, @Ctx() context: Log): Promise<void> {
    return this.mysteryboxServiceEth.unpack(event, context);
  }
}
