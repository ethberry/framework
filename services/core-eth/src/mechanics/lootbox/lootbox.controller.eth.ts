import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractEventType,
  ContractType,
  IDefaultRoyaltyInfo,
  ILootboxUnpack,
  ITokenApprove,
  ITokenApprovedForAll,
  ITokenRoyaltyInfo,
  ITokenTransfer,
} from "@framework/types";

import { LootboxServiceEth } from "./lootbox.service.eth";
import { AccessControlServiceEth } from "../../blockchain/access-control/access-control.service.eth";

@Controller()
export class LootboxControllerEth {
  constructor(
    private readonly tokenServiceEth: LootboxServiceEth,
    private readonly accessControlServiceEth: AccessControlServiceEth,
  ) {}

  @EventPattern({ contractType: ContractType.LOOTBOX, eventName: ContractEventType.Transfer })
  public transfer(@Payload() event: ILogEvent<ITokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.tokenServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.LOOTBOX, eventName: ContractEventType.Approval })
  public approval(@Payload() event: ILogEvent<ITokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.tokenServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.LOOTBOX, eventName: ContractEventType.ApprovalForAll })
  public approvalForAll(@Payload() event: ILogEvent<ITokenApprovedForAll>, @Ctx() context: Log): Promise<void> {
    return this.tokenServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.LOOTBOX, eventName: ContractEventType.UnpackLootbox })
  public unpackItem(@Payload() event: ILogEvent<ILootboxUnpack>, @Ctx() context: Log): Promise<void> {
    return this.tokenServiceEth.unpack(event, context);
  }
}
