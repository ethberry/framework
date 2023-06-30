import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { Public } from "@gemunion/nest-js-utils";
import type { IContract } from "@framework/types";

import { RaffleRoundService } from "./round.service";
import { RaffleRoundEntity } from "./round.entity";

@Public()
@ApiBearerAuth()
@Controller("/raffle/rounds")
export class RaffleRoundController {
  constructor(private readonly raffleRoundService: RaffleRoundService) {}

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<RaffleRoundEntity>> {
    return this.raffleRoundService.autocomplete();
  }

  @Get("/options")
  public options(): Promise<IContract> {
    return this.raffleRoundService.options();
  }
}
