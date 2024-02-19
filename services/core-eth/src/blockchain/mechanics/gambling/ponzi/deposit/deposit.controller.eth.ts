import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type {
  IFinalizedTokenEvent,
  IPonziDepositEvent,
  IPonziFinishEvent,
  IPonziWithdrawEvent,
  IWithdrawTokenEvent,
} from "@framework/types";
import { ContractType, PonziEventType } from "@framework/types";

import { PonziDepositServiceEth } from "./deposit.service.eth";

@Controller()
export class PonziDepositControllerEth {
  constructor(private readonly ponziServiceEth: PonziDepositServiceEth) {}

  @EventPattern({ contractType: ContractType.PONZI, eventName: PonziEventType.StakingStart })
  public start(@Payload() event: ILogEvent<IPonziDepositEvent>, @Ctx() context: Log): Promise<void> {
    return this.ponziServiceEth.start(event, context);
  }

  @EventPattern({ contractType: ContractType.PONZI, eventName: PonziEventType.StakingWithdraw })
  public withdraw(@Payload() event: ILogEvent<IPonziWithdrawEvent>, @Ctx() context: Log): Promise<void> {
    return this.ponziServiceEth.withdraw(event, context);
  }

  @EventPattern({ contractType: ContractType.PONZI, eventName: PonziEventType.StakingFinish })
  public finish(@Payload() event: ILogEvent<IPonziFinishEvent>, @Ctx() context: Log): Promise<void> {
    return this.ponziServiceEth.finish(event, context);
  }

  @EventPattern([
    {
      contractType: ContractType.PONZI,
      eventName: PonziEventType.FinalizedToken,
    },
  ])
  public finishToken(
    @Payload() event: ILogEvent<IFinalizedTokenEvent | IPonziFinishEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.ponziServiceEth.finishToken(event, context);
  }

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
