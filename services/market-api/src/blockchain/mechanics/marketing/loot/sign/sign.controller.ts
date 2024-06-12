import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import type { IServerSignature } from "@gemunion/types-blockchain";

import { SignLootboxDto } from "./dto";
import { LootSignService } from "./sign.service";

@ApiBearerAuth()
@Controller("/loot")
export class LootSignController {
  constructor(private readonly lootSignService: LootSignService) {}

  @Post("/sign")
  public sign(@Body() dto: SignLootboxDto): Promise<IServerSignature> {
    return this.lootSignService.sign(dto);
  }
}
