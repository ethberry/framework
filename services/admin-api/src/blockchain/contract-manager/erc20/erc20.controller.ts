import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@ethberry/nest-js-utils";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { ContractManagerErc20SignService } from "./erc20.sign.service";
import { Erc20ContractDeployDto } from "./dto";

@ApiBearerAuth()
@Controller("/contract-manager")
export class ContractManagerErc20Controller {
  constructor(private readonly contractManagerErc20SignService: ContractManagerErc20SignService) {}

  @Post("/erc20")
  public deploy(@Body() dto: Erc20ContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerErc20SignService.deploy(dto, userEntity);
  }
}
