import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractEventType,
  ContractType,
  IERC721TokenApprovedForAllEvent,
  IERC721TokenApproveEvent,
  IERC721TokenTransferEvent,
  IUnpackWrapper,
} from "@framework/types";

import { WrapperServiceEth } from "./wrapper.service.eth";
import { TokenServiceEth } from "../../hierarchy/token/token.service.eth";

@Controller()
export class WrapperControllerEth {
  constructor(
    private readonly tokenServiceEth: TokenServiceEth,
    private readonly wrapperServiceEth: WrapperServiceEth,
  ) {}

  @EventPattern({ contractType: ContractType.WRAPPER, eventName: ContractEventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IERC721TokenTransferEvent>, @Ctx() context: Log): Promise<void> {
    return this.wrapperServiceEth.transfer(event, context);
  }

  @EventPattern([{ contractType: ContractType.WRAPPER, eventName: ContractEventType.UnpackWrapper }])
  public unpack(
    @Payload()
    event: ILogEvent<IUnpackWrapper>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.wrapperServiceEth.unpack(event, context);
  }

  @EventPattern({ contractType: ContractType.WRAPPER, eventName: ContractEventType.Approval })
  public approval(@Payload() event: ILogEvent<IERC721TokenApproveEvent>, @Ctx() context: Log): Promise<void> {
    return this.tokenServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.WRAPPER, eventName: ContractEventType.ApprovalForAll })
  public approvalForAll(
    @Payload() event: ILogEvent<IERC721TokenApprovedForAllEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.tokenServiceEth.approvalForAll(event, context);
  }
}
