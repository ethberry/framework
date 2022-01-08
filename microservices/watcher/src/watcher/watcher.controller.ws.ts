import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Block } from "@ethersproject/abstract-provider";

import { EventTypes } from "@gemunion/nestjs-ethers";

import { WatcherServiceWs } from "./watcher.service.ws";
import { IEthContext } from "./interfaces";

@Controller()
export class WatcherControllerWs {
  constructor(private readonly ethServiceWs: WatcherServiceWs) {}

  @EventPattern({ eventName: EventTypes.BLOCK })
  public block(@Payload() data: Block, @Ctx() context: IEthContext): Promise<void> {
    return this.ethServiceWs.block(data, context);
  }
}
