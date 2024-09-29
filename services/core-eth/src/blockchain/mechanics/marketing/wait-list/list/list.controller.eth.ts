import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IWaitListRewardClaimedEvent, IWaitListRewardSetEvent } from "@framework/types";
import { ContractType, WaitListEventType } from "@framework/types";

import { WaitListListServiceEth } from "./list.service.eth";

@Controller()
export class WaitListListControllerEth {
  constructor(private readonly waitListListServiceEth: WaitListListServiceEth) {}

  @EventPattern([{ contractType: ContractType.WAIT_LIST, eventName: WaitListEventType.WaitListRewardSet }])
  public rewardSet(@Payload() event: ILogEvent<IWaitListRewardSetEvent>, @Ctx() context: Log): Promise<void> {
    return this.waitListListServiceEth.rewardSet(event, context);
  }

  @EventPattern([{ contractType: ContractType.WAIT_LIST, eventName: WaitListEventType.WaitListRewardClaimed }])
  public rewardClaimed(@Payload() event: ILogEvent<IWaitListRewardClaimedEvent>, @Ctx() context: Log): Promise<void> {
    return this.waitListListServiceEth.rewardClaimed(event, context);
  }
}
