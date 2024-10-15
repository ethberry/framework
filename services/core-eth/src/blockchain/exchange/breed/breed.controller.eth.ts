import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IExchangeBreedEvent } from "@framework/types";
import { ExchangeEventType } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
import { ExchangeBreedServiceEth } from "./breed.service.eth";

@Controller()
export class ExchangeBreedControllerEth {
  constructor(private readonly exchangeBreedServiceEth: ExchangeBreedServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Breed }])
  public breed(@Payload() event: ILogEvent<IExchangeBreedEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeBreedServiceEth.breed(event, context);
  }
}
