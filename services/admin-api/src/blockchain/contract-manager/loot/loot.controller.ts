import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@ethberry/nest-js-utils";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { ContractManagerLootSignService } from "./loot.sign.service";
import { LootContractDeployDto } from "./dto";

@ApiBearerAuth()
@Controller("/contract-manager")
export class ContractManagerLootController {
  constructor(private readonly contractManagerLootSignService: ContractManagerLootSignService) {}

  @Post("/loot")
  public deploy(@Body() dto: LootContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerLootSignService.deploy(dto, userEntity);
  }
}
