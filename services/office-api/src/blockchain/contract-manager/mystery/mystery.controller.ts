import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@ethberry/nest-js-utils";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { ContractManagerMysterySignService } from "./mystery.sign.service";
import { MysteryContractDeployDto } from "./dto";

@ApiBearerAuth()
@Controller("/contract-manager")
export class ContractManagerMysteryController {
  constructor(private readonly contractManagerMysterySignService: ContractManagerMysterySignService) {}

  @Post("/mystery")
  public mystery(@Body() dto: MysteryContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerMysterySignService.mystery(dto, userEntity);
  }
}
