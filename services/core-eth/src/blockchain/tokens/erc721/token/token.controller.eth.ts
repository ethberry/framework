import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IContractManagerERC721TokenDeployedEvent,
  IERC721TokenApprovedForAllEvent,
  IERC721TokenApproveEvent,
  IERC721TokenTransferEvent,
} from "@framework/types";
import { ContractManagerEventType, Erc721EventType } from "@framework/types";

import { ContractType } from "../../../../utils/contract-type";
import { Erc721TokenServiceEth } from "./token.service.eth";

@Controller()
export class Erc721TokenControllerEth {
  constructor(public readonly erc721TokenServiceEth: Erc721TokenServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: Erc721EventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IERC721TokenTransferEvent>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: Erc721EventType.Approval })
  public approval(@Payload() event: ILogEvent<IERC721TokenApproveEvent>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: Erc721EventType.ApprovalForAll })
  public approvalForAll(
    @Payload() event: ILogEvent<IERC721TokenApprovedForAllEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceEth.approvalForAll(event, context);
  }

  @EventPattern([
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.ERC721TokenDeployed },
  ])
  public deploy(
    @Payload() event: ILogEvent<IContractManagerERC721TokenDeployedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceEth.deploy(event, context);
  }
}
