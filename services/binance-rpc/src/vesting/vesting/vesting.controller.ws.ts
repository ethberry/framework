import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "web3-core";

import { ILogEvent } from "@gemunion/nestjs-web3";
import { Erc20VestingEventType, IErc20VestingERC20Released, IErc20VestingEtherReleased } from "@framework/types";

import { Erc20VestingServiceWs } from "./vesting.service.ws";

@Controller()
export class Erc20VestingControllerWs {
  constructor(private readonly erc20VestingServiceWs: Erc20VestingServiceWs) {}

  @EventPattern({ eventName: Erc20VestingEventType.ERC20Released })
  public erc20Released(@Payload() event: ILogEvent<IErc20VestingERC20Released>, @Ctx() context: Log): Promise<void> {
    return this.erc20VestingServiceWs.erc20Released(event, context);
  }

  @EventPattern({ eventName: Erc20VestingEventType.EtherReleased })
  public ethReleased(@Payload() event: ILogEvent<IErc20VestingEtherReleased>, @Ctx() context: Log): Promise<void> {
    return this.erc20VestingServiceWs.ethReleased(event, context);
  }
}
