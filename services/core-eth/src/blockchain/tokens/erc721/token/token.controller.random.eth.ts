import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type {
  IERC721TokenApprovedForAllEvent,
  IERC721TokenApproveEvent,
  IERC721TokenMintRandomEvent,
  IERC721TokenTransferEvent,
} from "@framework/types";
import { ContractEventType, ContractType } from "@framework/types";

import { Erc721TokenServiceEth } from "./token.service.eth";
import { Erc721TokenRandomServiceEth } from "./token.service.random.eth";
import { Erc721TokenControllerEth } from "./token.controller.eth";

@Controller()
export class Erc721TokenRandomControllerEth extends Erc721TokenControllerEth {
  constructor(
    private readonly erc721TokenRandomServiceEth: Erc721TokenRandomServiceEth,
    public readonly erc721TokenServiceEth: Erc721TokenServiceEth,
  ) {
    super(erc721TokenServiceEth);
  }

  @EventPattern({ contractType: ContractType.ERC721_TOKEN_RANDOM, eventName: ContractEventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IERC721TokenTransferEvent>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenRandomServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_TOKEN_RANDOM, eventName: ContractEventType.MintRandom })
  public mintRandom(@Payload() event: ILogEvent<IERC721TokenMintRandomEvent>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenRandomServiceEth.mintRandom(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_TOKEN_RANDOM, eventName: ContractEventType.Approval })
  public approval(@Payload() event: ILogEvent<IERC721TokenApproveEvent>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_TOKEN_RANDOM, eventName: ContractEventType.ApprovalForAll })
  public approvalForAll(
    @Payload() event: ILogEvent<IERC721TokenApprovedForAllEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceEth.approvalForAll(event, context);
  }
}
