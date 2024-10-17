import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import {
  ContractManagerEventType,
  type IContractManagerWaitListDeployedEvent,
  IWaitListRewardClaimedEvent,
  IWaitListRewardSetEvent,
} from "@framework/types";
import { WaitListEventType } from "@framework/types";

import { ContractType } from "../../../../../utils/contract-type";
import { WaitListListServiceEth } from "./list.service.eth";

@Controller()
export class WaitListListControllerEth {
  constructor(private readonly waitListListServiceEth: WaitListListServiceEth) {}

  @EventPattern({ contractType: ContractType.WAIT_LIST, eventName: WaitListEventType.WaitListRewardSet })
  public rewardSet(@Payload() event: ILogEvent<IWaitListRewardSetEvent>, @Ctx() context: Log): Promise<void> {
    return this.waitListListServiceEth.rewardSet(event, context);
  }

  @EventPattern({ contractType: ContractType.WAIT_LIST, eventName: WaitListEventType.WaitListRewardClaimed })
  public rewardClaimed(@Payload() event: ILogEvent<IWaitListRewardClaimedEvent>, @Ctx() context: Log): Promise<void> {
    return this.waitListListServiceEth.rewardClaimed(event, context);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.WaitListDeployed,
  })
  public waitList(@Payload() event: ILogEvent<IContractManagerWaitListDeployedEvent>, @Ctx() ctx: Log): Promise<void> {
    return this.waitListListServiceEth.deploy(event, ctx);
  }
}
