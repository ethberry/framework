import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";
import { ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { ContractAutocompleteDto, ContractSearchDto } from "./dto";
import { ContractService } from "./contract.service";
import { ContractEntity } from "./contract.entity";

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
    return this.contractService.search(
      dto,
      userEntity,
      [ModuleType.HIERARCHY],
      [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155],
    );
  }

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: ContractAutocompleteDto,
    @User() userEntity: UserEntity,
  ): Promise<Array<ContractEntity>> {
    return this.contractService.autocomplete(dto, userEntity);
  }
}
