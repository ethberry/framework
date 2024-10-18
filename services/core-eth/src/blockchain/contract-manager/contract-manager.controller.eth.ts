import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IContractManagerCollectionDeployedEvent,
  IContractManagerLootTokenDeployedEvent,
  IContractManagerLotteryDeployedEvent,
  IContractManagerMysteryTokenDeployedEvent,
  IContractManagerPonziDeployedEvent,
  IContractManagerRaffleDeployedEvent,
  IContractManagerStakingDeployedEvent,
  IContractManagerVestingDeployedEvent,
} from "@framework/types";
import { ContractManagerEventType } from "@framework/types";

import { ContractManagerServiceEth } from "./contract-manager.service.eth";
import { ContractType } from "../../utils/contract-type";

@Controller()
export class ContractManagerControllerEth {
  constructor(private readonly contractManagerServiceEth: ContractManagerServiceEth) {}

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.VestingDeployed,
  })
  public vesting(
    @Payload() event: ILogEvent<IContractManagerVestingDeployedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.contractManagerServiceEth.vesting(event, context);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.CollectionDeployed,
  })
  public collection(
    @Payload() event: ILogEvent<IContractManagerCollectionDeployedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.contractManagerServiceEth.erc721Collection(event, context);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.MysteryBoxDeployed,
  })
  public mystery(
    @Payload() event: ILogEvent<IContractManagerMysteryTokenDeployedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.contractManagerServiceEth.mystery(event, context);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.LootBoxDeployed,
  })
  public lootbox(
    @Payload() event: ILogEvent<IContractManagerLootTokenDeployedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.contractManagerServiceEth.loot(event, context);
  }

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
