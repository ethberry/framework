import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";
import { RaffleSignService } from "./sign.service";
import { SignRaffleDto } from "./dto";

@ApiBearerAuth()
@Controller("/raffle/ticket")
export class RaffleSignController {
  constructor(private readonly raffleSignService: RaffleSignService) {}

  @Post("/sign")
  public sign(@Body() dto: SignRaffleDto, @User() merchantEntity: MerchantEntity): Promise<IServerSignature> {
    return this.raffleSignService.sign(dto, merchantEntity);
  }
}
