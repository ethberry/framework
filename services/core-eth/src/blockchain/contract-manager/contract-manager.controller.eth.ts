import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IContractManagerLotteryDeployedEvent,
  IContractManagerPonziDeployedEvent,
  IContractManagerRaffleDeployedEvent,
  IContractManagerStakingDeployedEvent,
} from "@framework/types";
import { ContractManagerEventType } from "@framework/types";

import { ContractManagerServiceEth } from "./contract-manager.service.eth";
import { ContractType } from "../../utils/contract-type";

@Controller()
export class ContractManagerControllerEth {
  constructor(private readonly contractManagerServiceEth: ContractManagerServiceEth) {}

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.StakingDeployed,
  })
  public staking(
    @Payload() event: ILogEvent<IContractManagerStakingDeployedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.contractManagerServiceEth.staking(event, context);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.PonziDeployed,
  })
  public ponzi(@Payload() event: ILogEvent<IContractManagerPonziDeployedEvent>, @Ctx() context: Log): Promise<void> {
    return this.contractManagerServiceEth.ponzi(event, context);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.LotteryDeployed,
  })
  public lottery(
    @Payload() event: ILogEvent<IContractManagerLotteryDeployedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.contractManagerServiceEth.lottery(event, context);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.RaffleDeployed,
  })
  public raffle(@Payload() event: ILogEvent<IContractManagerRaffleDeployedEvent>, @Ctx() context: Log): Promise<void> {
    return this.contractManagerServiceEth.raffle(event, context);
  }
}
