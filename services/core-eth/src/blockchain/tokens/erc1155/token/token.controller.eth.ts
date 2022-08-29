import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractEventType,
  ContractType,
  IErc1155TokenApprovalForAll,
  IErc1155TokenTransferBatch,
  IErc1155TokenTransferSingle,
  IErc1155TokenUri,
} from "@framework/types";

import { Erc1155TokenServiceEth } from "./token.service.eth";

@Controller()
export class Erc1155TokenControllerEth {
  constructor(private readonly erc1155ServiceEth: Erc1155TokenServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC1155_TOKEN, eventName: ContractEventType.TransferSingle })
  public transferSingle(@Payload() event: ILogEvent<IErc1155TokenTransferSingle>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceEth.transferSingle(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_TOKEN, eventName: ContractEventType.TransferBatch })
  public transferBatch(@Payload() event: ILogEvent<IErc1155TokenTransferBatch>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceEth.transferBatch(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_TOKEN, eventName: ContractEventType.ApprovalForAll })
  public approvalForAll(@Payload() event: ILogEvent<IErc1155TokenApprovalForAll>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_TOKEN, eventName: ContractEventType.URI })
  public uri(@Payload() event: ILogEvent<IErc1155TokenUri>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceEth.uri(event, context);
  }
}
