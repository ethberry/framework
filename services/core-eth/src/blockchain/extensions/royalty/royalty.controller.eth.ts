import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { ContractType, IDefaultRoyaltyInfoEvent, ITokenRoyaltyInfoEvent, RoyaltyEventType } from "@framework/types";

import { RoyaltyServiceEth } from "./royalty.service.eth";

@Controller()
export class RoyaltyControllerEth {
  constructor(private readonly royaltyServiceEth: RoyaltyServiceEth) {}

  @EventPattern([
    {
      contractType: ContractType.ERC1155_TOKEN,
      eventName: RoyaltyEventType.DefaultRoyaltyInfo,
    },
    {
      contractType: ContractType.ERC998_TOKEN,
      eventName: RoyaltyEventType.DefaultRoyaltyInfo,
    },
    {
      contractType: ContractType.ERC998_TOKEN_RANDOM,
      eventName: RoyaltyEventType.DefaultRoyaltyInfo,
    },
    {
      contractType: ContractType.ERC721_TOKEN,
      eventName: RoyaltyEventType.DefaultRoyaltyInfo,
    },
    {
      contractType: ContractType.ERC721_TOKEN_RANDOM,
      eventName: RoyaltyEventType.DefaultRoyaltyInfo,
    },
    { contractType: ContractType.MYSTERY, eventName: RoyaltyEventType.DefaultRoyaltyInfo },
    { contractType: ContractType.WRAPPER, eventName: RoyaltyEventType.DefaultRoyaltyInfo },
    { contractType: ContractType.LOTTERY, eventName: RoyaltyEventType.DefaultRoyaltyInfo },
  ])
  public defaultRoyaltyInfo(@Payload() event: ILogEvent<IDefaultRoyaltyInfoEvent>, @Ctx() context: Log): Promise<void> {
    return this.royaltyServiceEth.defaultRoyaltyInfo(event, context);
  }

  @EventPattern([
    {
      contractType: ContractType.ERC1155_TOKEN,
      eventName: RoyaltyEventType.TokenRoyaltyInfo,
    },
    {
      contractType: ContractType.ERC998_TOKEN,
      eventName: RoyaltyEventType.TokenRoyaltyInfo,
    },
    {
      contractType: ContractType.ERC721_TOKEN,
      eventName: RoyaltyEventType.TokenRoyaltyInfo,
    },
    { contractType: ContractType.MYSTERY, eventName: RoyaltyEventType.TokenRoyaltyInfo },
    { contractType: ContractType.WRAPPER, eventName: RoyaltyEventType.TokenRoyaltyInfo },
    { contractType: ContractType.LOTTERY, eventName: RoyaltyEventType.TokenRoyaltyInfo },
  ])
  public tokenRoyaltyInfo(@Payload() event: ILogEvent<ITokenRoyaltyInfoEvent>, @Ctx() context: Log): Promise<void> {
    return this.royaltyServiceEth.tokenRoyaltyInfo(event, context);
  }
}
