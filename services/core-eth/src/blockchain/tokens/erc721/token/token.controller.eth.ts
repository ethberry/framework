import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractEventType, ContractType } from "@framework/types";

import type {
  IRandomRequest,
  ITokenApprove,
  ITokenApprovedForAll,
  ITokenMintRandom,
  ITokenTransfer,
} from "@framework/types";

import { Erc721TokenServiceEth } from "./token.service.eth";

@Controller()
export class Erc721TokenControllerEth {
  constructor(private readonly erc721TokenServiceEth: Erc721TokenServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: ContractEventType.Transfer })
  public transfer(@Payload() event: ILogEvent<ITokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: ContractEventType.Approval })
  public approval(@Payload() event: ILogEvent<ITokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: ContractEventType.ApprovalForAll })
  public approvalForAll(@Payload() event: ILogEvent<ITokenApprovedForAll>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: ContractEventType.MintRandom })
  public mintRandom(@Payload() event: ILogEvent<ITokenMintRandom>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.mintRandom(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: ContractEventType.RandomRequest })
  public randomRequest(@Payload() event: ILogEvent<IRandomRequest>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.randomRequest(event, context);
  }
}
