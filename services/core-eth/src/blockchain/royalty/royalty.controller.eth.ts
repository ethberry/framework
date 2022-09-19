import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractEventType, ContractType, IDefaultRoyaltyInfo, ITokenRoyaltyInfo } from "@framework/types";

import { RoyaltyServiceEth } from "./royalty.service.eth";

@Controller()
export class RoyaltyControllerEth {
  constructor(private readonly royaltyServiceEth: RoyaltyServiceEth) {}

  @EventPattern([
    {
      contractType: ContractType.ERC998_TOKEN,
      eventName: ContractEventType.DefaultRoyaltyInfo,
    },
    {
      contractType: ContractType.ERC721_TOKEN,
      eventName: ContractEventType.DefaultRoyaltyInfo,
    },
    { contractType: ContractType.MYSTERY, eventName: ContractEventType.DefaultRoyaltyInfo },
    { contractType: ContractType.WRAPPER, eventName: ContractEventType.DefaultRoyaltyInfo },
  ])
  public defaultRoyaltyInfo(@Payload() event: ILogEvent<IDefaultRoyaltyInfo>, @Ctx() context: Log): Promise<void> {
    return this.royaltyServiceEth.defaultRoyaltyInfo(event, context);
  }

  @EventPattern([
    {
      contractType: ContractType.ERC998_TOKEN,
      eventName: ContractEventType.TokenRoyaltyInfo,
    },
    {
      contractType: ContractType.ERC721_TOKEN,
      eventName: ContractEventType.TokenRoyaltyInfo,
    },
    { contractType: ContractType.MYSTERY, eventName: ContractEventType.TokenRoyaltyInfo },
    { contractType: ContractType.WRAPPER, eventName: ContractEventType.TokenRoyaltyInfo },
  ])
  public tokenRoyaltyInfo(@Payload() event: ILogEvent<ITokenRoyaltyInfo>, @Ctx() context: Log): Promise<void> {
    return this.royaltyServiceEth.tokenRoyaltyInfo(event, context);
  }
}
