import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@ethberry/nest-js-utils";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { ContractManagerPonziSignService } from "./ponzi.sign.service";
import { PonziContractDeployDto } from "./dto";

@ApiBearerAuth()
@Controller("/contract-manager")
export class ContractManagerPonziController {
  constructor(private readonly contractManagerPonziSignService: ContractManagerPonziSignService) {}

  @Post("/ponzi")
  public deploy(@Body() dto: PonziContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerPonziSignService.deploy(dto, userEntity);
  }
}
