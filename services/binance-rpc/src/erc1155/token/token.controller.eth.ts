import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  AccessControlEventType,
  ContractType,
  Erc1155TokenEventType,
  IAccessControlRoleAdminChanged,
  IErc1155TokenApprovalForAll,
  IErc1155TokenTransferBatch,
  IErc1155TokenTransferSingle,
  IErc1155TokenUri,
  IErc20RoleGrant,
} from "@framework/types";

import { Erc1155TokenServiceEth } from "./token.service.eth";
import { AccessControlServiceEth } from "../../blockchain/access-control/access-control.service.eth";

@Controller()
export class Erc1155TokenControllerEth {
  constructor(
    private readonly erc1155ServiceEth: Erc1155TokenServiceEth,
    private readonly accessControlServiceEth: AccessControlServiceEth,
  ) {}

  @EventPattern({ contractType: ContractType.ERC1155_TOKEN, eventName: Erc1155TokenEventType.TransferSingle })
  public transferSingle(@Payload() event: ILogEvent<IErc1155TokenTransferSingle>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceEth.transferSingle(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_TOKEN, eventName: Erc1155TokenEventType.TransferBatch })
  public transferBatch(@Payload() event: ILogEvent<IErc1155TokenTransferBatch>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceEth.transferBatch(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_TOKEN, eventName: Erc1155TokenEventType.ApprovalForAll })
  public approvalForAll(@Payload() event: ILogEvent<IErc1155TokenApprovalForAll>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_TOKEN, eventName: Erc1155TokenEventType.URI })
  public uri(@Payload() event: ILogEvent<IErc1155TokenUri>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceEth.uri(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_TOKEN, eventName: AccessControlEventType.RoleGranted })
  public roleGrant(@Payload() event: ILogEvent<IErc20RoleGrant>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleGranted(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_TOKEN, eventName: AccessControlEventType.RoleRevoked })
  public roleRevoke(@Payload() event: ILogEvent<IErc20RoleGrant>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleRevoked(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_TOKEN, eventName: AccessControlEventType.RoleAdminChanged })
  public roleAdmin(@Payload() event: ILogEvent<IAccessControlRoleAdminChanged>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleAdminChanged(event, context);
  }
}
