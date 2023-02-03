import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractType, ExchangeEventType, IExchangeBreedEvent } from "@framework/types";

import { ExchangeBreedServiceEth } from "./breed.service.eth";

@Controller()
export class ExchangeBreedControllerEth {
  constructor(private readonly exchangeBreedServiceEth: ExchangeBreedServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Breed }])
  public breed(@Payload() event: ILogEvent<IExchangeBreedEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeBreedServiceEth.breed(event, context);
  }
}
