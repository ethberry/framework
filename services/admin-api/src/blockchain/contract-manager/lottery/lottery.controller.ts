import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@ethberry/nest-js-utils";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { ContractManagerLotterySignService } from "./lottery.sign.service";
import { LotteryContractDeployDto } from "./dto";

@ApiBearerAuth()
@Controller("/contract-manager")
export class ContractManagerLotteryController {
  constructor(private readonly contractManagerLotterySignService: ContractManagerLotterySignService) {}

  @Post("/lottery")
  public lottery(@Body() dto: LotteryContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerLotterySignService.lottery(dto, userEntity);
  }
}
