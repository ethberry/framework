import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IContractManagerCommonDeployedEvent,
  IErc1155TokenApprovalForAllEvent,
  IErc1155TokenTransferBatchEvent,
  IErc1155TokenTransferSingleEvent,
  IErc1155TokenUriEvent,
} from "@framework/types";
import { ContractManagerEventType, Erc1155EventType } from "@framework/types";

import { ContractType } from "../../../../utils/contract-type";
import { Erc1155TokenServiceEth } from "./token.service.eth";

@Controller()
export class Erc1155TokenControllerEth {
  constructor(private readonly erc1155ServiceEth: Erc1155TokenServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC1155_TOKEN, eventName: Erc1155EventType.TransferSingle })
  public transferSingle(
    @Payload() event: ILogEvent<IErc1155TokenTransferSingleEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc1155ServiceEth.transferSingle(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_TOKEN, eventName: Erc1155EventType.TransferBatch })
  public transferBatch(
    @Payload() event: ILogEvent<IErc1155TokenTransferBatchEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc1155ServiceEth.transferBatch(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_TOKEN, eventName: Erc1155EventType.ApprovalForAll })
  public approvalForAll(
    @Payload() event: ILogEvent<IErc1155TokenApprovalForAllEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc1155ServiceEth.approvalForAllErc1155(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_TOKEN, eventName: Erc1155EventType.URI })
  public uri(@Payload() event: ILogEvent<IErc1155TokenUriEvent>, @Ctx() context: Log): Promise<void> {
    return this.erc1155ServiceEth.uri(event, context);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.ERC1155TokenDeployed,
  })
  public deploy(@Payload() event: ILogEvent<IContractManagerCommonDeployedEvent>): void {
    return this.erc1155ServiceEth.deploy(event);
  }
}
