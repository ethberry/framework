import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IContractManagerCommonDeployedEvent, IPausedEvent } from "@framework/types";
import { ContractManagerEventType, PausableEventType } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
import { PauseServiceEth } from "./pause.service.eth";

@Controller()
export class PauseControllerEth {
  constructor(private readonly pauseServiceEth: PauseServiceEth) {}

  @EventPattern([{ contractType: ContractType.PAUSE, eventName: PausableEventType.Paused }])
  public pause(@Payload() event: ILogEvent<IPausedEvent>, @Ctx() context: Log): Promise<void> {
    return this.pauseServiceEth.pause(event, context);
  }

  @EventPattern([{ contractType: ContractType.PAUSE, eventName: PausableEventType.Unpaused }])
  public unpause(@Payload() event: ILogEvent<IPausedEvent>, @Ctx() context: Log): Promise<void> {
    return this.pauseServiceEth.unpause(event, context);
  }

  @EventPattern([
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.WaitListDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.MysteryBoxDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.LootBoxDeployed },
  ])
  public deploy(@Payload() event: ILogEvent<IContractManagerCommonDeployedEvent>): void {
    return this.pauseServiceEth.deploy(event);
  }
}
