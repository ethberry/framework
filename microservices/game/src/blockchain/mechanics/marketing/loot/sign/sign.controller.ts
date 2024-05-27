import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { User } from "@gemunion/nest-js-utils";

import { MerchantEntity } from "../../../../../infrastructure/merchant/merchant.entity";
import { LootSignService } from "./sign.service";
import { SignLootboxDto } from "./dto";

@ApiBearerAuth()
@Controller("/loot")
export class LootSignController {
  constructor(private readonly lootSignService: LootSignService) {}

  @Post("/sign")
  public sign(@Body() dto: SignLootboxDto, @User() merchantEntity: MerchantEntity): Promise<IServerSignature> {
    return this.lootSignService.sign(dto, merchantEntity);
  }
}
