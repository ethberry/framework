import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  IFinalizedToken,
  IPyramidDeposit,
  IPyramidFinish,
  IPyramidWithdraw,
  IWithdrawToken,
  PyramidEventType,
} from "@framework/types";

import { PyramidStakesServiceEth } from "./stakes.service.eth";

@Controller()
export class PyramidStakesControllerEth {
  constructor(private readonly pyramidServiceEth: PyramidStakesServiceEth) {}

  @EventPattern({ contractType: ContractType.PYRAMID, eventName: PyramidEventType.StakingStart })
  public start(@Payload() event: ILogEvent<IPyramidDeposit>, @Ctx() context: Log): Promise<void> {
    return this.pyramidServiceEth.start(event, context);
  }

  @EventPattern({ contractType: ContractType.PYRAMID, eventName: PyramidEventType.StakingWithdraw })
  public withdraw(@Payload() event: ILogEvent<IPyramidWithdraw>, @Ctx() context: Log): Promise<void> {
    return this.pyramidServiceEth.withdraw(event, context);
  }

  @EventPattern({ contractType: ContractType.PYRAMID, eventName: PyramidEventType.StakingFinish })
  public finish(@Payload() event: ILogEvent<IPyramidFinish>, @Ctx() context: Log): Promise<void> {
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
    @Payload() event: ILogEvent<IWithdrawToken | IFinalizedToken>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.pyramidServiceEth.finishToken(event, context);
  }
}
