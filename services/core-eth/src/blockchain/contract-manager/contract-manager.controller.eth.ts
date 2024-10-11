import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IContractManagerCollectionDeployedEvent,
  IContractManagerERC1155TokenDeployedEvent,
  IContractManagerERC998TokenDeployedEvent,
  IContractManagerLotteryDeployedEvent,
  IContractManagerLootTokenDeployedEvent,
  IContractManagerMysteryTokenDeployedEvent,
  IContractManagerPaymentSplitterDeployedEvent,
  IContractManagerPonziDeployedEvent,
  IContractManagerRaffleDeployedEvent,
  IContractManagerStakingDeployedEvent,
  IContractManagerVestingDeployedEvent,
  IContractManagerWaitListDeployedEvent,
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
  public vesting(@Payload() event: ILogEvent<IContractManagerVestingDeployedEvent>, @Ctx() ctx: Log): Promise<void> {
    return this.contractManagerServiceEth.vesting(event, ctx);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.CollectionDeployed,
  })
  public collection(
    @Payload() event: ILogEvent<IContractManagerCollectionDeployedEvent>,
    @Ctx() ctx: Log,
  ): Promise<void> {
    return this.contractManagerServiceEth.erc721Collection(event, ctx);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.ERC998TokenDeployed,
  })
  public erc998Token(
    @Payload() event: ILogEvent<IContractManagerERC998TokenDeployedEvent>,
    @Ctx() ctx: Log,
  ): Promise<void> {
    return this.contractManagerServiceEth.erc998Token(event, ctx);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.ERC1155TokenDeployed,
  })
  public erc1155Token(
    @Payload() event: ILogEvent<IContractManagerERC1155TokenDeployedEvent>,
    @Ctx() ctx: Log,
  ): Promise<void> {
    return this.contractManagerServiceEth.erc1155Token(event, ctx);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.MysteryBoxDeployed,
  })
  public mystery(
    @Payload() event: ILogEvent<IContractManagerMysteryTokenDeployedEvent>,
    @Ctx() ctx: Log,
  ): Promise<void> {
    return this.contractManagerServiceEth.mystery(event, ctx);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.LootBoxDeployed,
  })
  public lootbox(@Payload() event: ILogEvent<IContractManagerLootTokenDeployedEvent>, @Ctx() ctx: Log): Promise<void> {
    return this.contractManagerServiceEth.loot(event, ctx);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.StakingDeployed,
  })
  public staking(@Payload() event: ILogEvent<IContractManagerStakingDeployedEvent>, @Ctx() ctx: Log): Promise<void> {
    return this.contractManagerServiceEth.staking(event, ctx);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.PonziDeployed,
  })
  public ponzi(@Payload() event: ILogEvent<IContractManagerPonziDeployedEvent>, @Ctx() ctx: Log): Promise<void> {
    return this.contractManagerServiceEth.ponzi(event, ctx);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.LotteryDeployed,
  })
  public lottery(@Payload() event: ILogEvent<IContractManagerLotteryDeployedEvent>, @Ctx() ctx: Log): Promise<void> {
    return this.contractManagerServiceEth.lottery(event, ctx);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.RaffleDeployed,
  })
  public raffle(@Payload() event: ILogEvent<IContractManagerRaffleDeployedEvent>, @Ctx() ctx: Log): Promise<void> {
    return this.contractManagerServiceEth.raffle(event, ctx);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.WaitListDeployed,
  })
  public waitList(@Payload() event: ILogEvent<IContractManagerWaitListDeployedEvent>, @Ctx() ctx: Log): Promise<void> {
    return this.contractManagerServiceEth.waitList(event, ctx);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.PaymentSplitterDeployed,
  })
  public paymentSplitter(
    @Payload() event: ILogEvent<IContractManagerPaymentSplitterDeployedEvent>,
    @Ctx() ctx: Log,
  ): Promise<void> {
    return this.contractManagerServiceEth.paymentSplitter(event, ctx);
  }
}
