import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { RaffleSignService } from "./sign.service";
import { SignRaffleDto } from "./dto";

@ApiBearerAuth()
@Controller("/raffle/ticket")
export class RaffleSignController {
  constructor(private readonly raffleSignService: RaffleSignService) {}

  @Post("/sign")
  public sign(@Body() dto: SignRaffleDto): Promise<IServerSignature> {
    return this.raffleSignService.sign(dto);
  }
}
