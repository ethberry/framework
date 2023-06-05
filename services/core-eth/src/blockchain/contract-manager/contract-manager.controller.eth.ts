import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";

import {
  ContractManagerEventType,
  ContractType,
  IContractManagerCollectionDeployedEvent,
  IContractManagerERC1155TokenDeployedEvent,
  IContractManagerERC20TokenDeployedEvent,
  IContractManagerERC721TokenDeployedEvent,
  IContractManagerERC998TokenDeployedEvent,
  IContractManagerMysteryTokenDeployedEvent,
  IContractManagerPyramidDeployedEvent,
  IContractManagerStakingDeployedEvent,
  IContractManagerVestingDeployedEvent,
} from "@framework/types";

import { ContractManagerServiceEth } from "./contract-manager.service.eth";

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
    eventName: ContractManagerEventType.ERC20TokenDeployed,
  })
  public erc20Token(
    @Payload() event: ILogEvent<IContractManagerERC20TokenDeployedEvent>,
    @Ctx() ctx: Log,
  ): Promise<void> {
    return this.contractManagerServiceEth.erc20Token(event, ctx);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.ERC721TokenDeployed,
  })
  public erc721Token(
    @Payload() event: ILogEvent<IContractManagerERC721TokenDeployedEvent>,
    @Ctx() ctx: Log,
  ): Promise<void> {
    return this.contractManagerServiceEth.erc721Token(event, ctx);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.CollectionDeployed,
  })
  public erc721Collection(
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
    eventName: ContractManagerEventType.MysteryboxDeployed,
  })
  public mysterybox(
    @Payload() event: ILogEvent<IContractManagerMysteryTokenDeployedEvent>,
    @Ctx() ctx: Log,
  ): Promise<void> {
    return this.contractManagerServiceEth.mysteryBox(event, ctx);
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
    eventName: ContractManagerEventType.PyramidDeployed,
  })
  public pyramid(@Payload() event: ILogEvent<IContractManagerPyramidDeployedEvent>, @Ctx() ctx: Log): Promise<void> {
    return this.contractManagerServiceEth.pyramid(event, ctx);
  }
}
