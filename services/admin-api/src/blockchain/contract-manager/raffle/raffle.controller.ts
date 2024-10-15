import { Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@ethberry/nest-js-utils";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { ContractManagerRaffleSignService } from "./raffle.sign.service";

@ApiBearerAuth()
@Controller("/contract-manager")
export class ContractManagerRaffleController {
  constructor(private readonly contractManagerRaffleSignService: ContractManagerRaffleSignService) {}

  @Post("/raffle")
  public raffle(@User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerRaffleSignService.raffle(userEntity);
  }
}
