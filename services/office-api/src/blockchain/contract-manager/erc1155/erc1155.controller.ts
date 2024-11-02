import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@ethberry/nest-js-utils";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { ContractManagerSignErc1155Service } from "./erc1155.sign.service";
import { Erc1155ContractDeployDto } from "./dto";

@ApiBearerAuth()
@Controller("/contract-manager")
export class ContractManagerErc1155Controller {
  constructor(private readonly contractManagerSignErc1155Service: ContractManagerSignErc1155Service) {}

  @Post("/erc1155")
  public deploy(
    @Body() dto: Erc1155ContractDeployDto,
    @User() userEntity: UserEntity,
  ): Promise<IServerSignature> {
    return this.contractManagerSignErc1155Service.deploy(dto, userEntity);
  }
}
