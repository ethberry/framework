import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import type { IServerSignature } from "@ethberry/types-blockchain";
import { User } from "@ethberry/nest-js-utils";

import { MerchantEntity } from "../../../../../infrastructure/merchant/merchant.entity";
import { MysterySignService } from "./sign.service";
import { MysteryBoxSignDto } from "./dto";

@ApiBearerAuth()
@Controller("/mystery")
export class MysterySignController {
  constructor(private readonly mysterySignService: MysterySignService) {}

  @Post("/sign")
  public sign(@Body() dto: MysteryBoxSignDto, @User() merchantEntity: MerchantEntity): Promise<IServerSignature> {
    return this.mysterySignService.sign(dto, merchantEntity);
  }
}
