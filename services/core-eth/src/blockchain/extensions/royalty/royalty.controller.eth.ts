import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IContractManagerCommonDeployedEvent,
  IDefaultRoyaltyInfoEvent,
  ITokenRoyaltyInfoEvent,
} from "@framework/types";
import { ContractManagerEventType, RoyaltyEventType } from "@framework/types";

import { RoyaltyServiceEth } from "./royalty.service.eth";
import { ContractType } from "../../../utils/contract-type";

@Controller()
export class RoyaltyControllerEth {
  constructor(private readonly royaltyServiceEth: RoyaltyServiceEth) {}

  @EventPattern([{ contractType: ContractType.ROYALTY, eventName: RoyaltyEventType.DefaultRoyaltyInfo }])
  public defaultRoyaltyInfo(@Payload() event: ILogEvent<IDefaultRoyaltyInfoEvent>, @Ctx() context: Log): Promise<void> {
    return this.royaltyServiceEth.defaultRoyaltyInfo(event, context);
  }

  @EventPattern([{ contractType: ContractType.ROYALTY, eventName: RoyaltyEventType.TokenRoyaltyInfo }])
  public tokenRoyaltyInfo(@Payload() event: ILogEvent<ITokenRoyaltyInfoEvent>, @Ctx() context: Log): Promise<void> {
    return this.royaltyServiceEth.tokenRoyaltyInfo(event, context);
  }

  @EventPattern([
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.ERC721TokenDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.ERC998TokenDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.ERC1155TokenDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.MysteryBoxDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.LootBoxDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.VestingBoxDeployed }
  ])
  public deploy(@Payload() event: ILogEvent<IContractManagerCommonDeployedEvent>): void {
    return this.royaltyServiceEth.deploy(event);
  }
}
