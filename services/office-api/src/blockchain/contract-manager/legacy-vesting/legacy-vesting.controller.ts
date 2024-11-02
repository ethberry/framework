import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@ethberry/nest-js-utils";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { ContractManagerVestingSignService } from "./legacy-vesting.sign.service";
import { LegacyVestingContractDeployDto } from "./dto";

@ApiBearerAuth()
@Controller("/contract-manager")
export class ContractManagerLegacyVestingController {
  constructor(private readonly contractManagerSignService: ContractManagerVestingSignService) {}

  @Post("/legacy-vesting")
  public deploy(@Body() dto: LegacyVestingContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerSignService.deploy(dto, userEntity);
  }
}
