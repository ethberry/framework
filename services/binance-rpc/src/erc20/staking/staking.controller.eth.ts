import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import { Erc20StakingEventType, IErc20StakingDeposit, IErc20StakingWithdraw, ContractType } from "@framework/types";

import { Erc20StakingServiceEth } from "./staking.service.eth";

@Controller()
export class Erc20StakingControllerEth {
  constructor(private readonly erc20StakingServiceEth: Erc20StakingServiceEth) {}
  @EventPattern({ contractType: ContractType.ERC20_STAKING, eventName: Erc20StakingEventType.StakingStart })
  public transfer(@Payload() event: ILogEvent<IErc20StakingDeposit>, @Ctx() context: Log): Promise<void> {
    return this.erc20StakingServiceEth.start(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC20_STAKING, eventName: Erc20StakingEventType.StakingWithdraw })
  public approval(@Payload() event: ILogEvent<IErc20StakingWithdraw>, @Ctx() context: Log): Promise<void> {
    return this.erc20StakingServiceEth.withdraw(event, context);
  }
}
