import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractEventType,
  ContractType,
  IRandomRequest,
  ITokenApprove,
  ITokenApprovedForAll,
  ITokenMintRandom,
  ITokenTransfer,
} from "@framework/types";

import { Erc998TokenServiceEth } from "./token.service.eth";

@Controller()
export class Erc998TokenControllerEth {
  constructor(private readonly erc998TokenServiceEth: Erc998TokenServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC998_TOKEN, eventName: ContractEventType.Transfer })
  public transfer(@Payload() event: ILogEvent<ITokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.erc998TokenServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN, eventName: ContractEventType.Approval })
  public approval(@Payload() event: ILogEvent<ITokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.erc998TokenServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN, eventName: ContractEventType.ApprovalForAll })
  public approvalForAll(@Payload() event: ILogEvent<ITokenApprovedForAll>, @Ctx() context: Log): Promise<void> {
    return this.erc998TokenServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN, eventName: ContractEventType.MintRandom })
  public mintRandom(@Payload() event: ILogEvent<ITokenMintRandom>, @Ctx() context: Log): Promise<void> {
    return this.erc998TokenServiceEth.mintRandom(event, context);
  }

  // dev test - random request
  @EventPattern({ contractType: ContractType.ERC998_TOKEN, eventName: "RandomRequest" })
  public randomRequest(@Payload() event: ILogEvent<IRandomRequest>, @Ctx() context: Log): Promise<void> {
    return this.erc998TokenServiceEth.randomRequest(event, context);
  }
}
