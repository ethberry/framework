import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@ethberry/nest-js-utils";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { ContractManagerPredictionSignService } from "./prediction.sign.service";
import { PredictionContractDeployDto } from "./dto";

@ApiBearerAuth()
@Controller("/contract-manager")
export class ContractManagerPredictionController {
  constructor(private readonly contractManagerSignService: ContractManagerPredictionSignService) {}

  @Post("/prediction")
  public deploy(
    @Body() dto: PredictionContractDeployDto,
    @User() userEntity: UserEntity,
  ): Promise<IServerSignature> {
    return this.contractManagerSignService.deploy(dto, userEntity);
  }
}
