import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { IEvent } from "@gemunion/nestjs-web3";
import {
  Erc1155TokenEventType,
  IErc1155TokenApprovalForAll,
  IErc1155TokenTransferBatch,
  IErc1155TokenTransferSingle,
  IErc1155TokenUri,
} from "@framework/types";

import { ContractType } from "../../common/interfaces";
import { Erc1155TokenServiceWs } from "./token.service.ws";

@Controller()
export class Erc1155TokenControllerWs {
  constructor(private readonly erc1155ServiceWs: Erc1155TokenServiceWs) {}

  @EventPattern({ contractName: ContractType.ERC1155_RESOURCES, eventName: Erc1155TokenEventType.TransferSingle })
  public transferSingle(@Payload() event: IEvent<IErc1155TokenTransferSingle>): Promise<void> {
    return this.erc1155ServiceWs.transferSingle(event);
  }

  @EventPattern({ contractName: ContractType.ERC1155_RESOURCES, eventName: Erc1155TokenEventType.TransferBatch })
  public transferBatch(@Payload() event: IEvent<IErc1155TokenTransferBatch>): Promise<void> {
    return this.erc1155ServiceWs.transferBatch(event);
  }

  @EventPattern({ contractName: ContractType.ERC1155_RESOURCES, eventName: Erc1155TokenEventType.ApprovalForAll })
  public approvalForAll(@Payload() event: IEvent<IErc1155TokenApprovalForAll>): Promise<void> {
    return this.erc1155ServiceWs.approvalForAll(event);
  }

  @EventPattern({ contractName: ContractType.ERC1155_RESOURCES, eventName: Erc1155TokenEventType.URI })
  public uri(@Payload() event: IEvent<IErc1155TokenUri>): Promise<void> {
    return this.erc1155ServiceWs.uri(event);
  }
}
