import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IContractManagerCommonDeployedEvent,
  IContractManagerERC1155TokenDeployedEvent,
  IContractManagerERC721TokenDeployedEvent,
  IVrfSubscriptionSetEvent,
} from "@framework/types";
import { ChainLinkEventType, ContractManagerEventType } from "@framework/types";

import { ContractType } from "../../../../utils/contract-type";
import { ChainLinkConsumerServiceEth } from "./consumer.service.eth";

@Controller()
export class ChainLinkConsumerControllerEth {
  constructor(private readonly chainLinkConsumerServiceEth: ChainLinkConsumerServiceEth) {}

  @EventPattern({ contractType: ContractType.VRF_CONSUMER, eventName: ChainLinkEventType.VrfSubscriptionSet })
  public setSubscription(@Payload() event: ILogEvent<IVrfSubscriptionSetEvent>, @Ctx() context: Log): Promise<void> {
    return this.chainLinkConsumerServiceEth.setVrfSubscription(event, context);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.ERC721TokenDeployed,
  })
  public deploy1(@Payload() event: ILogEvent<IContractManagerERC721TokenDeployedEvent>): void {
    return this.chainLinkConsumerServiceEth.deploy1(event);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.ERC998TokenDeployed,
  })
  public deploy2(@Payload() event: ILogEvent<IContractManagerERC1155TokenDeployedEvent>): void {
    return this.chainLinkConsumerServiceEth.deploy2(event);
  }

  @EventPattern([
    {
      contractType: ContractType.CONTRACT_MANAGER,
      eventName: ContractManagerEventType.LootBoxDeployed,
    },
    {
      contractType: ContractType.CONTRACT_MANAGER,
      eventName: ContractManagerEventType.RaffleDeployed,
    },
    {
      contractType: ContractType.CONTRACT_MANAGER,
      eventName: ContractManagerEventType.LotteryDeployed,
    },
  ])
  public deploy3(@Payload() event: ILogEvent<IContractManagerCommonDeployedEvent>): void {
    return this.chainLinkConsumerServiceEth.deploy3(event);
  }
}
