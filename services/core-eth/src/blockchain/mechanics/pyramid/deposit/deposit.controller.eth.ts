import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  IFinalizedTokenEvent,
  IPyramidDepositEvent,
  IPyramidFinishEvent,
  IPyramidWithdrawEvent,
  IWithdrawTokenEvent,
  PyramidEventType,
} from "@framework/types";

import { PyramidDepositServiceEth } from "./deposit.service.eth";

@Controller()
export class PyramidDepositControllerEth {
  constructor(private readonly pyramidServiceEth: PyramidDepositServiceEth) {}

  @EventPattern({ contractType: ContractType.PYRAMID, eventName: PyramidEventType.StakingStart })
  public start(@Payload() event: ILogEvent<IPyramidDepositEvent>, @Ctx() context: Log): Promise<void> {
    return this.pyramidServiceEth.start(event, context);
  }

  @EventPattern({ contractType: ContractType.PYRAMID, eventName: PyramidEventType.StakingWithdraw })
  public withdraw(@Payload() event: ILogEvent<IPyramidWithdrawEvent>, @Ctx() context: Log): Promise<void> {
    return this.pyramidServiceEth.withdraw(event, context);
  }

  @EventPattern({ contractType: ContractType.PYRAMID, eventName: PyramidEventType.StakingFinish })
  public finish(@Payload() event: ILogEvent<IPyramidFinishEvent>, @Ctx() context: Log): Promise<void> {
    return this.pyramidServiceEth.finish(event, context);
  }

  @EventPattern([
    {
      contractType: ContractType.PYRAMID,
      eventName: PyramidEventType.FinalizedToken,
    },
    {
      contractType: ContractType.PYRAMID,
      eventName: PyramidEventType.WithdrawToken,
    },
  ])
  public finishToken(
    @Payload() event: ILogEvent<IFinalizedTokenEvent | IWithdrawTokenEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.pyramidServiceEth.finishToken(event, context);
  }
}
