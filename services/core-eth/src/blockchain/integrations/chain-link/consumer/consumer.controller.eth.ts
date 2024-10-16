import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IContractManagerERC721TokenDeployedEvent,
  IContractManagerERC1155TokenDeployedEvent,
  IContractManagerLootTokenDeployedEvent,
  IContractManagerLotteryDeployedEvent,
  IContractManagerRaffleDeployedEvent,
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

  @EventPattern([
    {
      contractType: ContractType.CONTRACT_MANAGER,
      eventName: ContractManagerEventType.ERC721TokenDeployed,
    },
  ])
  public erc721Token(
    @Payload() event: ILogEvent<IContractManagerERC721TokenDeployedEvent>,
    @Ctx() ctx: Log,
  ): Promise<void> {
    return this.chainLinkConsumerServiceEth.deploy1(event, ctx);
  }

  @EventPattern([
    {
      contractType: ContractType.CONTRACT_MANAGER,
      eventName: ContractManagerEventType.ERC998TokenDeployed,
    },
  ])
  public erc998Token(
    @Payload() event: ILogEvent<IContractManagerERC1155TokenDeployedEvent>,
    @Ctx() ctx: Log,
  ): Promise<void> {
    return this.chainLinkConsumerServiceEth.deploy2(event, ctx);
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
  public erc721Loot(
    @Payload()
    event: ILogEvent<
      | IContractManagerLootTokenDeployedEvent
      | IContractManagerLotteryDeployedEvent
      | IContractManagerRaffleDeployedEvent
    >,
    @Ctx() ctx: Log,
  ): Promise<void> {
    return this.chainLinkConsumerServiceEth.deploy3(event, ctx);
  }
}
