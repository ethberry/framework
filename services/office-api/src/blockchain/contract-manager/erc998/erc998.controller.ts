import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@ethberry/nest-js-utils";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { ContractManagerErc998SignService } from "./erc998.sign.service";
import { Erc998ContractDeployDto } from "./dto";

@ApiBearerAuth()
@Controller("/contract-manager")
export class ContractManagerErc998Controller {
  constructor(private readonly contractManagerErc998SignService: ContractManagerErc998SignService) {}

  @Post("/erc998")
  public deploy(@Body() dto: Erc998ContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerErc998SignService.deploy(dto, userEntity);
  }
}
