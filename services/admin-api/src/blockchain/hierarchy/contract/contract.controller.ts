import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";

import { ContractAutocompleteDto } from "./dto";
import { ContractService } from "./contract.service";
import { ContractEntity } from "./contract.entity";
import { UserEntity } from "../../../user/user.entity";

@ApiBearerAuth()
@Controller("/contracts")
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: ContractAutocompleteDto,
    @User() userEntity: UserEntity,
  ): Promise<Array<ContractEntity>> {
    return this.contractService.autocomplete(dto, userEntity);
  }
}
