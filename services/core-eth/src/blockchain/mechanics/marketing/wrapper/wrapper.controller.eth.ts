import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import {
  Erc721EventType,
  type IERC721TokenApprovedForAllEvent,
  type IERC721TokenApproveEvent,
  type IERC721TokenTransferEvent,
  IUnpackWrapper,
} from "@framework/types";
import { WrapperEventType } from "@framework/types";

import { WrapperServiceEth } from "./wrapper.service.eth";
import { ContractType } from "../../../../utils/contract-type";

@Controller()
export class WrapperControllerEth {
  constructor(private readonly wrapperServiceEth: WrapperServiceEth) {}

  @EventPattern({ contractType: ContractType.WRAPPER, eventName: Erc721EventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IERC721TokenTransferEvent>, @Ctx() context: Log): Promise<void> {
    return this.wrapperServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.WRAPPER, eventName: Erc721EventType.Approval })
  public approval(@Payload() event: ILogEvent<IERC721TokenApproveEvent>, @Ctx() context: Log): Promise<void> {
    return this.wrapperServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.WRAPPER, eventName: Erc721EventType.ApprovalForAll })
  public approvalForAll(
    @Payload() event: ILogEvent<IERC721TokenApprovedForAllEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.wrapperServiceEth.approvalForAll(event, context);
  }

  @EventPattern([{ contractType: ContractType.WRAPPER, eventName: WrapperEventType.UnpackWrapper }])
  public unpack(
    @Payload()
    event: ILogEvent<IUnpackWrapper>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.wrapperServiceEth.unpack(event, context);
  }
}
