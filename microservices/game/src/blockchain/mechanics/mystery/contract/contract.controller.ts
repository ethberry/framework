import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { ContractAutocompleteDto, ContractSearchDto } from "../../../hierarchy/contract/dto";
import { MysteryContractService } from "./contract.service";

@ApiBearerAuth()
@Controller("/mystery/contracts")
export class MysteryContractController {
  constructor(private readonly mysteryContractService: MysteryContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: ContractSearchDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<[Array<ContractEntity>, number]> {
    return this.mysteryContractService.search(dto, merchantEntity);
  }

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: ContractAutocompleteDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<Array<ContractEntity>> {
    return this.mysteryContractService.autocomplete(dto, merchantEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.mysteryContractService.findOne({ id });
  }
}
