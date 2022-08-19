import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractEventType,
  ContractType,
  IErc20TokenApprove,
  IErc20TokenSnapshot,
  IErc20TokenTransfer,
} from "@framework/types";

import { Erc20TokenServiceEth } from "./token.service.eth";

@Controller()
export class Erc20TokenControllerEth {
  constructor(private readonly erc20TokenServiceEth: Erc20TokenServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC20_TOKEN, eventName: ContractEventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IErc20TokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.erc20TokenServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC20_TOKEN, eventName: ContractEventType.Approval })
  public approval(@Payload() event: ILogEvent<IErc20TokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.erc20TokenServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC20_TOKEN, eventName: ContractEventType.Snapshot })
  public snapshot(@Payload() event: ILogEvent<IErc20TokenSnapshot>, @Ctx() context: Log): Promise<void> {
    return this.erc20TokenServiceEth.snapshot(event, context);
  }
}
