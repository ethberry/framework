import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IBlacklistedEvent,
  IContractManagerERC20TokenDeployedEvent,
  IUnBlacklistedEvent,
  IUnWhitelistedEvent,
  IWhitelistedEvent,
} from "@framework/types";
import { AccessListEventType, ContractManagerEventType } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
import { AccessListServiceEth } from "./access-list.service.eth";

@Controller()
export class AccessListControllerEth {
  constructor(private readonly accessListServiceEth: AccessListServiceEth) {}

  @EventPattern({ contractType: ContractType.ACCESS_LIST, eventName: AccessListEventType.Blacklisted })
  public blacklisted(@Payload() event: ILogEvent<IBlacklistedEvent>, @Ctx() context: Log): Promise<void> {
    return this.accessListServiceEth.blacklisted(event, context);
  }

  @EventPattern({ contractType: ContractType.ACCESS_LIST, eventName: AccessListEventType.UnBlacklisted })
  public unBlacklisted(@Payload() event: ILogEvent<IUnBlacklistedEvent>, @Ctx() context: Log): Promise<void> {
    return this.accessListServiceEth.unBlacklisted(event, context);
  }

  @EventPattern({ contractType: ContractType.ACCESS_LIST, eventName: AccessListEventType.Whitelisted })
  public whitelisted(@Payload() event: ILogEvent<IWhitelistedEvent>, @Ctx() context: Log): Promise<void> {
    return this.accessListServiceEth.whitelisted(event, context);
  }

  @EventPattern({ contractType: ContractType.ACCESS_LIST, eventName: AccessListEventType.UnWhitelisted })
  public unWhitelisted(@Payload() event: ILogEvent<IUnWhitelistedEvent>, @Ctx() context: Log): Promise<void> {
    return this.accessListServiceEth.unWhitelisted(event, context);
  }

  @EventPattern([
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.ERC20TokenDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.ERC721TokenDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.ERC998TokenDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.ERC1155TokenDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.CollectionDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.MysteryBoxDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.LootBoxDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.RaffleDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.LotteryDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.PonziDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.StakingDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.WaitListDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.PaymentSplitterDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.VestingDeployed },
  ])
  public erc721Token(
    @Payload() event: ILogEvent<IContractManagerERC20TokenDeployedEvent>,
    @Ctx() ctx: Log,
  ): Promise<void> {
    return this.accessListServiceEth.deploy(event, ctx);
  }
}
