import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@ethberry/nest-js-utils";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { ContractManagerErc721SignService } from "./erc271.sign.service";
import { Erc721ContractDeployDto } from "./dto";

@ApiBearerAuth()
@Controller("/contract-manager")
export class ContractManagerErc721Controller {
  constructor(private readonly contractManagerErc721SignService: ContractManagerErc721SignService) {}

  @Post("/erc721")
  public deploy(@Body() dto: Erc721ContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerErc721SignService.deploy(dto, userEntity);
  }
}
