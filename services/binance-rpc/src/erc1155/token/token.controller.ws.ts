import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "web3-core";

import { ILogEvent } from "@gemunion/nestjs-web3";
import {
  Erc1155TokenEventType,
  IErc1155RoleGrant,
  IErc1155TokenApprovalForAll,
  IErc1155TokenTransferBatch,
  IErc1155TokenTransferSingle,
  IErc1155TokenUri,
} from "@framework/types";

import { Erc1155TokenServiceWs } from "./token.service.ws";

@Controller()
export class Erc1155TokenControllerWs {
  constructor(private readonly erc1155ServiceWs: Erc1155TokenServiceWs) {}

  @EventPattern({ eventName: Erc1155TokenEventType.TransferSingle })
  public transferSingle(@Payload() event: ILogEvent<IErc1155TokenTransferSingle>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceWs.transferSingle(event, context);
  }

  @EventPattern({ eventName: Erc1155TokenEventType.TransferBatch })
  public transferBatch(@Payload() event: ILogEvent<IErc1155TokenTransferBatch>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceWs.transferBatch(event, context);
  }

  @EventPattern({ eventName: Erc1155TokenEventType.ApprovalForAll })
  public approvalForAll(@Payload() event: ILogEvent<IErc1155TokenApprovalForAll>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceWs.approvalForAll(event, context);
  }

  @EventPattern({ eventName: Erc1155TokenEventType.URI })
  public uri(@Payload() event: ILogEvent<IErc1155TokenUri>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceWs.uri(event, context);
  }

  @EventPattern({ eventName: Erc1155TokenEventType.URI })
  public transfer(@Payload() event: ILogEvent<IErc1155TokenUri>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceWs.uri(event, context);
  }

  @EventPattern({ eventName: Erc1155TokenEventType.RoleGranted })
  public roleGrant(@Payload() event: ILogEvent<IErc1155RoleGrant>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceWs.roleGrant(event, context);
  }

  @EventPattern({ eventName: Erc1155TokenEventType.RoleRevoked })
  public roleRevoke(@Payload() event: ILogEvent<IErc1155RoleGrant>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceWs.roleRevoke(event, context);
  }
}
