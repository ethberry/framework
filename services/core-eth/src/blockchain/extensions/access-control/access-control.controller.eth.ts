import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IAccessControlRoleAdminChangedEvent,
  IAccessControlRoleGrantedEvent,
  IAccessControlRoleRevokedEvent,
  IContractManagerERC20TokenDeployedEvent,
  IOwnershipTransferredEvent,
} from "@framework/types";
import { AccessControlEventType, ContractManagerEventType } from "@framework/types";

import { AccessControlServiceEth } from "./access-control.service.eth";
import { ContractType } from "../../../utils/contract-type";

@Controller()
export class AccessControlControllerEth {
  constructor(private readonly accessControlServiceEth: AccessControlServiceEth) {}

  @EventPattern([{ contractType: ContractType.ACCESS_CONTROLL, eventName: AccessControlEventType.RoleGranted }])
  public roleGrant(@Payload() event: ILogEvent<IAccessControlRoleGrantedEvent>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleGranted(event, context);
  }

  @EventPattern([{ contractType: ContractType.ACCESS_CONTROLL, eventName: AccessControlEventType.RoleRevoked }])
  public roleRevoke(@Payload() event: ILogEvent<IAccessControlRoleRevokedEvent>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleRevoked(event, context);
  }

  @EventPattern([{ contractType: ContractType.ACCESS_CONTROLL, eventName: AccessControlEventType.RoleAdminChanged }])
  public roleAdmin(
    @Payload() event: ILogEvent<IAccessControlRoleAdminChangedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.accessControlServiceEth.roleAdminChanged(event, context);
  }

  @EventPattern([
    {
      contractType: ContractType.VESTING,
      eventName: AccessControlEventType.OwnershipTransferred,
    },
  ])
  public ownershipTransferred(
    @Payload() event: ILogEvent<IOwnershipTransferredEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.accessControlServiceEth.ownershipTransferred(event, context);
  }

  @EventPattern([
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.ERC20TokenDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.ERC721TokenDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.ERC998TokenDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.ERC1155TokenDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.CollectionDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.MysteryBoxDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.LootBoxDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.StakingDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.PonziDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.VestingDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.LotteryDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.RaffleDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.PaymentSplitterDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.WaitListDeployed },
  ])
  public deploy(
    @Payload() event: ILogEvent<IContractManagerERC20TokenDeployedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.accessControlServiceEth.deploy(event, context);
  }
}
