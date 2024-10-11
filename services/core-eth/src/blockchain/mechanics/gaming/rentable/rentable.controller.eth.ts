import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { RentableEventType, IRentableUpdateUserEvent } from "@framework/types";

import { RentableServiceEth } from "./rentable.service.eth";
import { ContractType } from "../../../../utils/contract-type";

@Controller()
export class RentableControllerEth {
  constructor(public readonly rentableServiceEth: RentableServiceEth) {}

  @EventPattern({ contractType: ContractType.RENTABLE, eventName: RentableEventType.UpdateUser })
  public updateUser(@Payload() event: ILogEvent<IRentableUpdateUserEvent>, @Ctx() context: Log): Promise<void> {
    return this.rentableServiceEth.updateUser(event, context);
  }
}
