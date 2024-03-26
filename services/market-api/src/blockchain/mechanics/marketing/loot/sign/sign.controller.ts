import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { LootBoxSignDto } from "./dto";
import { LootSignService } from "./sign.service";

@ApiBearerAuth()
@Controller("/loot")
export class LootSignController {
  constructor(private readonly lootSignService: LootSignService) {}

  @Post("/sign")
  public sign(@Body() dto: LootBoxSignDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.lootSignService.sign(dto, userEntity);
  }
}
