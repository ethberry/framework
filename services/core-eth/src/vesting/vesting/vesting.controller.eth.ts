import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  Erc20VestingEventType,
  IErc20VestingERC20Released,
  IErc20VestingEtherReleased,
} from "@framework/types";

import { Erc20VestingServiceEth } from "./vesting.service.eth";

@Controller()
export class Erc20VestingControllerEth {
  constructor(private readonly erc20VestingServiceEth: Erc20VestingServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC20_VESTING, eventName: Erc20VestingEventType.ERC20Released })
  public erc20Released(@Payload() event: ILogEvent<IErc20VestingERC20Released>, @Ctx() context: Log): Promise<void> {
    return this.erc20VestingServiceEth.erc20Released(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC20_VESTING, eventName: Erc20VestingEventType.EtherReleased })
  public ethReleased(@Payload() event: ILogEvent<IErc20VestingEtherReleased>, @Ctx() context: Log): Promise<void> {
    return this.erc20VestingServiceEth.ethReleased(event, context);
  }
}
