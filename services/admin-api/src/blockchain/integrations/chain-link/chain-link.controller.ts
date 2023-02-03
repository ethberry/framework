import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";

import { ChainLinkService } from "./chain-link.service";
import { ContractAutocompleteDto } from "../../hierarchy/contract/dto";
import { ContractEntity } from "../../hierarchy/contract/contract.entity";
import { UserEntity } from "../../../ecommerce/user/user.entity";

@ApiBearerAuth()
@Controller("/chain-link")
export class ChainLinkController {
  constructor(private readonly chainLinkService: ChainLinkService) {}

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: ContractAutocompleteDto,
    @User() userEntity: UserEntity,
  ): Promise<Array<ContractEntity>> {
    return this.chainLinkService.autocomplete(dto, userEntity);
  }
}
