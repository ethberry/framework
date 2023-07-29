import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type {
  IERC721TokenApprovedForAllEvent,
  IERC721TokenApproveEvent,
  IERC721TokenMintRandomEvent,
  IERC721TokenTransferEvent,
  IErc998TokenReceivedChildEvent,
  IErc998TokenSetMaxChildEvent,
  IErc998TokenTransferChildEvent,
  IErc998TokenUnWhitelistedChildEvent,
  IErc998TokenWhitelistedChildEvent,
  ILevelUp,
} from "@framework/types";
import {
  ContractEventType,
  ContractType,
  IErc998BatchReceivedChildEvent,
  IErc998BatchTransferChildEvent,
} from "@framework/types";

import { Erc998TokenServiceEth } from "./token.service.eth";
import { Erc998TokenControllerEth } from "./token.controller.eth";
import { Erc998TokenRandomServiceEth } from "./token.service.random.eth";

@Controller()
export class Erc998TokenRandomControllerEth extends Erc998TokenControllerEth {
  constructor(
    private readonly erc998TokenRandomServiceEth: Erc998TokenRandomServiceEth,
    public readonly erc998TokenServiceEth: Erc998TokenServiceEth,
  ) {
    super(erc998TokenServiceEth);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN_RANDOM, eventName: ContractEventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IERC721TokenTransferEvent>, @Ctx() context: Log): Promise<void> {
    return this.erc998TokenRandomServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN_RANDOM, eventName: ContractEventType.Approval })
  public approval(@Payload() event: ILogEvent<IERC721TokenApproveEvent>, @Ctx() context: Log): Promise<void> {
    return this.erc998TokenRandomServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN_RANDOM, eventName: ContractEventType.ApprovalForAll })
  public approvalForAll(
    @Payload() event: ILogEvent<IERC721TokenApprovedForAllEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc998TokenServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN_RANDOM, eventName: ContractEventType.MintRandom })
  public mintRandom(@Payload() event: ILogEvent<IERC721TokenMintRandomEvent>, @Ctx() context: Log): Promise<void> {
    return this.erc998TokenServiceEth.mintRandom(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN_RANDOM, eventName: ContractEventType.ReceivedChild })
  public receivedChild(
    @Payload() event: ILogEvent<IErc998TokenReceivedChildEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc998TokenServiceEth.receivedChild(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN_RANDOM, eventName: ContractEventType.BatchReceivedChild })
  public receivedChildBatch(
    @Payload() event: ILogEvent<IErc998BatchReceivedChildEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc998TokenServiceEth.receivedChildBatch(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN_RANDOM, eventName: ContractEventType.TransferChild })
  public transferChild(
    @Payload() event: ILogEvent<IErc998TokenTransferChildEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc998TokenServiceEth.transferChild(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN_RANDOM, eventName: ContractEventType.LevelUp })
  public levelUp(@Payload() event: ILogEvent<ILevelUp>, @Ctx() context: Log): Promise<void> {
    return this.erc998TokenServiceEth.levelUp(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN_RANDOM, eventName: ContractEventType.BatchTransferChild })
  public transferChildBatch(
    @Payload() event: ILogEvent<IErc998BatchTransferChildEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc998TokenServiceEth.transferChildBatch(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN_RANDOM, eventName: ContractEventType.WhitelistedChild })
  public whitelistChild(
    @Payload() event: ILogEvent<IErc998TokenWhitelistedChildEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc998TokenServiceEth.whitelistChild(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN_RANDOM, eventName: ContractEventType.SetMaxChild })
  public setMaxChild(@Payload() event: ILogEvent<IErc998TokenSetMaxChildEvent>, @Ctx() context: Log): Promise<void> {
    return this.erc998TokenServiceEth.setMaxChild(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN_RANDOM, eventName: ContractEventType.UnWhitelistedChild })
  public unWhitelistChild(
    @Payload() event: ILogEvent<IErc998TokenUnWhitelistedChildEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc998TokenServiceEth.unWhitelistChild(event, context);
  }
}
