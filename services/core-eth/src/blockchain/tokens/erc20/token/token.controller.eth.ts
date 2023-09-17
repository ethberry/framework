import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type {
  IErc1363TransferReceivedEvent,
  IErc20TokenApproveEvent,
  IErc20TokenSnapshotEvent,
  IErc20TokenTransferEvent,
} from "@framework/types";
import { ContractEventType, ContractType, Erc1363EventType } from "@framework/types";

import { Erc20TokenServiceEth } from "./token.service.eth";

@Controller()
export class Erc20TokenControllerEth {
  constructor(private readonly erc20TokenServiceEth: Erc20TokenServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC20_TOKEN, eventName: ContractEventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IErc20TokenTransferEvent>, @Ctx() context: Log): Promise<void> {
    return this.erc20TokenServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC20_TOKEN, eventName: ContractEventType.Approval })
  public approval(@Payload() event: ILogEvent<IErc20TokenApproveEvent>, @Ctx() context: Log): Promise<void> {
    return this.erc20TokenServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC20_TOKEN, eventName: ContractEventType.Snapshot })
  public snapshot(@Payload() event: ILogEvent<IErc20TokenSnapshotEvent>, @Ctx() context: Log): Promise<void> {
    return this.erc20TokenServiceEth.snapshot(event, context);
  }

  @EventPattern([
    { contractType: ContractType.EXCHANGE, eventName: Erc1363EventType.TransferReceived },
    { contractType: ContractType.STAKING, eventName: Erc1363EventType.TransferReceived },
    { contractType: ContractType.VESTING, eventName: Erc1363EventType.TransferReceived },
  ])
  public transferReceived(
    @Payload() event: ILogEvent<IErc1363TransferReceivedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc20TokenServiceEth.transferReceived(event, context);
  }
}
