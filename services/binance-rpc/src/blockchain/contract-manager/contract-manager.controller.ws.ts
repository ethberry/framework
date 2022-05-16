import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { IEvent } from "@gemunion/nestjs-web3";
import {
  ContractManagerEventType,
  IContractManagerERC1155TokenDeployed,
  IContractManagerERC20TokenDeployed,
  IContractManagerERC20VestingDeployed,
  IContractManagerERC721TokenDeployed,
} from "@framework/types";

import { ContractManagerServiceWs } from "./contract-manager.service.ws";
import { ContractType } from "../../common/interfaces";

@Controller()
export class ContractManagerControllerWs {
  constructor(private readonly contractManagerServiceWs: ContractManagerServiceWs) {}

  @EventPattern({
    contractName: ContractType.CONTRACT_MANAGER_ADDR,
    eventName: ContractManagerEventType.ERC20VestingDeployed,
  })
  public erc20Vesting(@Payload() event: IEvent<IContractManagerERC20VestingDeployed>): Promise<void> {
    return this.contractManagerServiceWs.erc20Vesting(event);
  }

  @EventPattern({
    contractName: ContractType.CONTRACT_MANAGER_ADDR,
    eventName: ContractManagerEventType.ERC20TokenDeployed,
  })
  public erc20Token(@Payload() event: IEvent<IContractManagerERC20TokenDeployed>): Promise<void> {
    return this.contractManagerServiceWs.erc20Token(event);
  }

  @EventPattern({
    contractName: ContractType.CONTRACT_MANAGER_ADDR,
    eventName: ContractManagerEventType.ERC721TokenDeployed,
  })
  public erc721Token(@Payload() event: IEvent<IContractManagerERC721TokenDeployed>): Promise<void> {
    return this.contractManagerServiceWs.erc721Token(event);
  }

  @EventPattern({
    contractName: ContractType.CONTRACT_MANAGER_ADDR,
    eventName: ContractManagerEventType.ERC1155TokenDeployed,
  })
  public erc1155Token(@Payload() event: IEvent<IContractManagerERC1155TokenDeployed>): Promise<void> {
    return this.contractManagerServiceWs.erc1155Token(event);
  }
}
