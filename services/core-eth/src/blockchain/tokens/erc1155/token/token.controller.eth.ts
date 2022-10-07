import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractEventType,
  ContractType,
  IErc1155TokenApprovalForAllEvent,
  IErc1155TokenTransferBatchEvent,
  IErc1155TokenTransferSingleEvent,
  IErc1155TokenUriEvent,
} from "@framework/types";

import { Erc1155TokenServiceEth } from "./token.service.eth";

@Controller()
export class Erc1155TokenControllerEth {
  constructor(private readonly erc1155ServiceEth: Erc1155TokenServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC1155_TOKEN, eventName: ContractEventType.TransferSingle })
  public transferSingle(
    @Payload() event: ILogEvent<IErc1155TokenTransferSingleEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc1155ServiceEth.transferSingle(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_TOKEN, eventName: ContractEventType.TransferBatch })
  public transferBatch(
    @Payload() event: ILogEvent<IErc1155TokenTransferBatchEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc1155ServiceEth.transferBatch(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_TOKEN, eventName: ContractEventType.ApprovalForAll })
  public approvalForAll(
    @Payload() event: ILogEvent<IErc1155TokenApprovalForAllEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc1155ServiceEth.approvalForAllErc1155(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_TOKEN, eventName: ContractEventType.URI })
  public uri(@Payload() event: ILogEvent<IErc1155TokenUriEvent>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceEth.uri(event, context);
  }
}
