import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { IEvent } from "@gemunion/nestjs-web3";

import { SeaportServiceWs } from "./seaport.service.ws";
import { ContractType } from "../../common/interfaces";
import {
  ISeaportNonceIncremented,
  ISeaportOrderCancelled,
  ISeaportOrderFulfilled,
  ISeaportOrderValidated,
  SeaportEventType,
} from "../seaport-history/interfaces";

@Controller()
export class SeaportControllerWs {
  constructor(private readonly contractManagerServiceWs: SeaportServiceWs) {}

  @EventPattern({
    contractName: ContractType.SEAPORT,
    eventName: SeaportEventType.OrderFulfilled,
  })
  public orderFulfilled(@Payload() event: IEvent<ISeaportOrderFulfilled>): Promise<void> {
    return this.contractManagerServiceWs.orderFulfilled(event);
  }

  @EventPattern({
    contractName: ContractType.SEAPORT,
    eventName: SeaportEventType.OrderCancelled,
  })
  public orderCancelled(@Payload() event: IEvent<ISeaportOrderCancelled>): Promise<void> {
    return this.contractManagerServiceWs.orderCancelled(event);
  }

  @EventPattern({
    contractName: ContractType.SEAPORT,
    eventName: SeaportEventType.OrderValidated,
  })
  public orderValidated(@Payload() event: IEvent<ISeaportOrderValidated>): Promise<void> {
    return this.contractManagerServiceWs.orderValidated(event);
  }

  @EventPattern({
    contractName: ContractType.SEAPORT,
    eventName: SeaportEventType.NonceIncremented,
  })
  public nonceIncremented(@Payload() event: IEvent<ISeaportNonceIncremented>): Promise<void> {
    return this.contractManagerServiceWs.nonceIncremented(event);
  }
}
