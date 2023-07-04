import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { Public } from "@gemunion/nest-js-utils";
import { RaffleRoundService } from "./round.service";
import { RaffleRoundEntity } from "./round.entity";
import { RaffleOptionsDto } from "./dto";
import { IRaffleContractRound } from "@framework/types";

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
  public options(@Query() dto: RaffleOptionsDto): Promise<IRaffleContractRound> {
    return this.raffleRoundService.options(dto);
  }
}
