import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractType } from "@framework/types";

import { SeaportServiceEth } from "./seaport.service.eth";
import {
  ISeaportNonceIncremented,
  ISeaportOrderCancelled,
  ISeaportOrderFulfilled,
  ISeaportOrderValidated,
  SeaportEventType,
} from "./seaport-history/interfaces";

@Controller()
export class SeaportControllerEth {
  constructor(private readonly contractManagerServiceEth: SeaportServiceEth) {}

  @EventPattern({
    contractName: ContractType.SEAPORT,
    eventName: SeaportEventType.OrderFulfilled,
  })
  public orderFulfilled(@Payload() event: ILogEvent<ISeaportOrderFulfilled>, @Ctx() context: Log): Promise<void> {
    return this.contractManagerServiceEth.orderFulfilled(event, context);
  }

  @EventPattern({
    contractName: ContractType.SEAPORT,
    eventName: SeaportEventType.OrderCancelled,
  })
  public orderCancelled(@Payload() event: ILogEvent<ISeaportOrderCancelled>, @Ctx() context: Log): Promise<void> {
    return this.contractManagerServiceEth.orderCancelled(event, context);
  }

  @EventPattern({
    contractName: ContractType.SEAPORT,
    eventName: SeaportEventType.OrderValidated,
  })
  public orderValidated(@Payload() event: ILogEvent<ISeaportOrderValidated>, @Ctx() context: Log): Promise<void> {
    return this.contractManagerServiceEth.orderValidated(event, context);
  }

  @EventPattern({
    contractName: ContractType.SEAPORT,
    eventName: SeaportEventType.NonceIncremented,
  })
  public nonceIncremented(@Payload() event: ILogEvent<ISeaportNonceIncremented>, @Ctx() context: Log): Promise<void> {
    return this.contractManagerServiceEth.nonceIncremented(event, context);
  }
}
