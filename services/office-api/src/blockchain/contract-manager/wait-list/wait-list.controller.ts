import { Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@ethberry/nest-js-utils";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { ContractManagerWaitListSignService } from "./wait-list.sign.service";

@ApiBearerAuth()
@Controller("/contract-manager")
export class ContractManagerWaitListController {
  constructor(private readonly contractManagerSignService: ContractManagerWaitListSignService) {}

  @Post("/wait-list")
  public deploy(@User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerSignService.deploy(userEntity);
  }
}
