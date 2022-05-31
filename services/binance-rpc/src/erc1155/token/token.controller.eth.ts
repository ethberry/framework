import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  Erc1155TokenEventType,
  IErc1155RoleGrant,
  IErc1155TokenApprovalForAll,
  IErc1155TokenTransferBatch,
  IErc1155TokenTransferSingle,
  IErc1155TokenUri,
} from "@framework/types";

import { Erc1155TokenServiceEth } from "./token.service.eth";

@Controller()
export class Erc1155TokenControllerEth {
  constructor(private readonly erc1155ServiceEth: Erc1155TokenServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC1155_COLLECTION, eventName: Erc1155TokenEventType.TransferSingle })
  public transferSingle(@Payload() event: ILogEvent<IErc1155TokenTransferSingle>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceEth.transferSingle(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_COLLECTION, eventName: Erc1155TokenEventType.TransferBatch })
  public transferBatch(@Payload() event: ILogEvent<IErc1155TokenTransferBatch>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceEth.transferBatch(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_COLLECTION, eventName: Erc1155TokenEventType.ApprovalForAll })
  public approvalForAll(@Payload() event: ILogEvent<IErc1155TokenApprovalForAll>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_COLLECTION, eventName: Erc1155TokenEventType.URI })
  public uri(@Payload() event: ILogEvent<IErc1155TokenUri>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceEth.uri(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_COLLECTION, eventName: Erc1155TokenEventType.RoleGranted })
  public roleGrant(@Payload() event: ILogEvent<IErc1155RoleGrant>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceEth.roleGrant(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_COLLECTION, eventName: Erc1155TokenEventType.RoleRevoked })
  public roleRevoke(@Payload() event: ILogEvent<IErc1155RoleGrant>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceEth.roleRevoke(event, context);
  }
}
