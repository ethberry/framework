import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";

import { ChainLinkContractService } from "./contract.service";
import { ContractAutocompleteDto } from "../../../hierarchy/contract/dto";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/chain-link")
export class ChainLinkContractController {
  constructor(private readonly chainLinkContractService: ChainLinkContractService) {}

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: ContractAutocompleteDto,
    @User() userEntity: UserEntity,
  ): Promise<Array<ContractEntity>> {
    return this.chainLinkContractService.autocomplete(dto, userEntity);
  }
}
