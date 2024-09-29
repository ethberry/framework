import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@ethberry/nest-js-utils";

import { ContractAutocompleteDto, ContractSearchDto } from "../../../../hierarchy/contract/dto";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { MerchantEntity } from "../../../../../infrastructure/merchant/merchant.entity";
import { PredictionContractService } from "./contract.service";

@ApiBearerAuth()
@Controller("/prediction/contracts")
export class PredictionContractController {
  constructor(private readonly predictionContractService: PredictionContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: ContractSearchDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<[Array<ContractEntity>, number]> {
    return this.predictionContractService.search(dto, merchantEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.predictionContractService.findOne({ id });
  }

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: ContractAutocompleteDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<Array<ContractEntity>> {
    return this.predictionContractService.autocomplete(dto, merchantEntity);
  }
}
