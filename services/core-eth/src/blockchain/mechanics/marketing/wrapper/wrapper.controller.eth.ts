import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IUnpackWrapper } from "@framework/types";
import { WrapperEventType } from "@framework/types";

import { WrapperServiceEth } from "./wrapper.service.eth";
import { ContractType } from "../../../../utils/contract-type";

@Controller()
export class WrapperControllerEth {
  constructor(private readonly wrapperServiceEth: WrapperServiceEth) {}

  @EventPattern([{ contractType: ContractType.WRAPPER, eventName: WrapperEventType.UnpackWrapper }])
  public unpack(
    @Payload()
    event: ILogEvent<IUnpackWrapper>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.wrapperServiceEth.unpack(event, context);
  }
}
