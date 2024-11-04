import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@ethberry/nest-js-utils";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { ContractManagerStakingSignService } from "./staking.sign.service";
import { StakingContractDeployDto } from "./dto";

@ApiBearerAuth()
@Controller("/contract-manager")
export class ContractManagerStakingController {
  constructor(private readonly contractManagerStakingSignService: ContractManagerStakingSignService) {}

  @Post("/staking")
  public deploy(@Body() dto: StakingContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerStakingSignService.deploy(dto, userEntity);
  }
}