import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { ContractAutocompleteDto, ContractSearchDto } from "./dto";
import { ContractService } from "./contract.service";
import { ContractEntity } from "./contract.entity";
import { UserEntity } from "../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/contracts")
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: ContractSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<ContractEntity>, number]> {
    return this.contractService.search(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: ContractAutocompleteDto,
    @User() userEntity: UserEntity,
  ): Promise<Array<ContractEntity>> {
    return this.contractService.autocomplete(dto, userEntity);
  }
}
