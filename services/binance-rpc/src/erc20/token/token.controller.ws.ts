import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "web3-core";

import { ILogEvent } from "@gemunion/nestjs-web3";
import {
  Erc20TokenEventType,
  IErc20RoleGrant,
  IErc20TokenApprove,
  IErc20TokenSnapshot,
  IErc20TokenTransfer,
} from "@framework/types";

import { Erc20TokenServiceWs } from "./token.service.ws";

@Controller()
export class Erc20TokenControllerWs {
  constructor(private readonly erc20TokenServiceWs: Erc20TokenServiceWs) {}

  @EventPattern({ eventName: Erc20TokenEventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IErc20TokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.erc20TokenServiceWs.transfer(event, context);
  }

  @EventPattern({ eventName: Erc20TokenEventType.Approval })
  public approval(@Payload() event: ILogEvent<IErc20TokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.erc20TokenServiceWs.approval(event, context);
  }

  @EventPattern({ eventName: Erc20TokenEventType.Snapshot })
  public snapshot(@Payload() event: ILogEvent<IErc20TokenSnapshot>, @Ctx() context: Log): Promise<void> {
    return this.erc20TokenServiceWs.snapshot(event, context);
  }

  @EventPattern({ eventName: Erc20TokenEventType.RoleGranted })
  public roleGrant(@Payload() event: ILogEvent<IErc20RoleGrant>, @Ctx() context: Log): Promise<void> {
    return this.erc20TokenServiceWs.roleGrant(event, context);
  }

  @EventPattern({ eventName: Erc20TokenEventType.RoleRevoked })
  public roleRevoke(@Payload() event: ILogEvent<IErc20RoleGrant>, @Ctx() context: Log): Promise<void> {
    return this.erc20TokenServiceWs.roleRevoke(event, context);
  }
}
