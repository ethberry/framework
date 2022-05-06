import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { IEvent } from "@gemunion/nestjs-web3";
import { Erc20TokenEventType, IErc20TokenApprove, IErc20TokenSnapshot, IErc20TokenTransfer } from "@framework/types";

import { ContractType } from "../../common/interfaces";
import { Erc20TokenServiceWs } from "./token.service.ws";

@Controller()
export class Erc20TokenControllerWs {
  constructor(private readonly erc20TokenServiceWs: Erc20TokenServiceWs) {}

  @EventPattern({ contractName: ContractType.ERC20_COIN, eventName: Erc20TokenEventType.Transfer })
  public transfer(@Payload() event: IEvent<IErc20TokenTransfer>): Promise<void> {
    return this.erc20TokenServiceWs.transfer(event);
  }

  @EventPattern({ contractName: ContractType.ERC20_COIN, eventName: Erc20TokenEventType.Approval })
  public approval(@Payload() event: IEvent<IErc20TokenApprove>): Promise<void> {
    return this.erc20TokenServiceWs.approval(event);
  }

  @EventPattern({ contractName: ContractType.ERC20_COIN, eventName: Erc20TokenEventType.Snapshot })
  public snapshot(@Payload() event: IEvent<IErc20TokenSnapshot>): Promise<void> {
    return this.erc20TokenServiceWs.snapshot(event);
  }
}
