import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@ethberry/nest-js-utils";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { MerchantEntity } from "../../../../../infrastructure/merchant/merchant.entity";
import { RaffleSignService } from "./sign.service";
import { RaffleSignDto } from "./dto";

@ApiBearerAuth()
@Controller("/raffle/ticket")
export class RaffleSignController {
  constructor(private readonly raffleSignService: RaffleSignService) {}

  @Post("/sign")
  public sign(@Body() dto: RaffleSignDto, @User() merchantEntity: MerchantEntity): Promise<IServerSignature> {
    return this.raffleSignService.sign(dto, merchantEntity);
  }
}
