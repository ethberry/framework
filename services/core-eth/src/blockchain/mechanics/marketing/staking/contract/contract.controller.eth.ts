import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IStakingBalanceWithdrawEvent } from "@framework/types";
import { StakingEventType } from "@framework/types";

import { ContractType } from "../../../../../utils/contract-type";
import { StakingContractServiceEth } from "./contract.service.eth";

@Controller()
export class StakingRulesControllerEth {
  constructor(private readonly stakingContractServiceEth: StakingContractServiceEth) {}

  @EventPattern({ contractType: ContractType.STAKING, eventName: StakingEventType.BalanceWithdraw })
  public balanceWithdraw(
    @Payload() event: ILogEvent<IStakingBalanceWithdrawEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.stakingContractServiceEth.balanceWithdraw(event, context);
  }
}
