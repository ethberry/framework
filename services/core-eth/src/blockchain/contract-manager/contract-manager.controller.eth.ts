import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";

import {
  ContractManagerEventType,
  ContractType,
  IContractManagerERC1155TokenDeployed,
  IContractManagerERC20TokenDeployed,
  IContractManagerVestingDeployed,
  IContractManagerERC721TokenDeployed,
} from "@framework/types";

import { ContractManagerServiceEth } from "./contract-manager.service.eth";

@Controller()
export class ContractManagerControllerEth {
  constructor(private readonly contractManagerServiceEth: ContractManagerServiceEth) {}

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.ERC20VestingDeployed,
  })
  public erc20Vesting(@Payload() event: ILogEvent<IContractManagerVestingDeployed>, @Ctx() ctx: Log): Promise<void> {
    return this.contractManagerServiceEth.vesting(event, ctx);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.ERC20TokenDeployed,
  })
  public erc20Token(@Payload() event: ILogEvent<IContractManagerERC20TokenDeployed>, @Ctx() ctx: Log): Promise<void> {
    return this.contractManagerServiceEth.erc20Token(event, ctx);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.ERC721TokenDeployed,
  })
  public erc721Token(@Payload() event: ILogEvent<IContractManagerERC721TokenDeployed>, @Ctx() ctx: Log): Promise<void> {
    return this.contractManagerServiceEth.erc721Token(event, ctx);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.ERC1155TokenDeployed,
  })
  public erc1155Token(
    @Payload() event: ILogEvent<IContractManagerERC1155TokenDeployed>,
    @Ctx() ctx: Log,
  ): Promise<void> {
    return this.contractManagerServiceEth.erc1155Token(event, ctx);
  }
}
