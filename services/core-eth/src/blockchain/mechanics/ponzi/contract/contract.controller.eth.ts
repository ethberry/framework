import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IWithdrawTokenEvent } from "@framework/types";
import { ContractType, PonziEventType } from "@framework/types";

import { PonziContractServiceEth } from "./contract.service.eth";

@Controller()
export class PonziDepositControllerEth {
  constructor(private readonly ponziServiceEth: PonziContractServiceEth) {}

  @EventPattern([
    {
      contractType: ContractType.PONZI,
      eventName: PonziEventType.WithdrawToken,
    },
  ])
  public withdrawToken(@Payload() event: ILogEvent<IWithdrawTokenEvent>, @Ctx() context: Log): Promise<void> {
    return this.ponziServiceEth.withdrawToken(event, context);
  }
}
