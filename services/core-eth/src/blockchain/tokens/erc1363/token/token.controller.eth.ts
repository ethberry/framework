import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IErc1363TransferReceivedEvent } from "@framework/types";
import { Erc1363EventType } from "@framework/types";

import { ContractType } from "../../../../utils/contract-type";
import { Erc1363TokenServiceEth } from "./token.service.eth";

@Controller()
export class Erc1363TokenControllerEth {
  constructor(private readonly erc1363TokenServiceEth: Erc1363TokenServiceEth) {}

  @EventPattern([
    { contractType: ContractType.LOTTERY, eventName: Erc1363EventType.TransferReceived },
    { contractType: ContractType.RAFFLE, eventName: Erc1363EventType.TransferReceived },
    { contractType: ContractType.PREDICTION, eventName: Erc1363EventType.TransferReceived },
    { contractType: ContractType.PONZI, eventName: Erc1363EventType.TransferReceived },
    { contractType: ContractType.STAKING, eventName: Erc1363EventType.TransferReceived },
    { contractType: ContractType.VESTING, eventName: Erc1363EventType.TransferReceived },
    { contractType: ContractType.WAIT_LIST, eventName: Erc1363EventType.TransferReceived },
  ])
  public transferReceived(
    @Payload() event: ILogEvent<IErc1363TransferReceivedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc1363TokenServiceEth.transferReceived(event, context);
  }
}
