import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { ContractAutocompleteDto, ContractSearchDto } from "../../../hierarchy/contract/dto";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";
import { RaffleContractService } from "./raffle.service";

@ApiBearerAuth()
@Controller("/raffle/contracts")
export class RaffleContractController {
  constructor(private readonly raffleContractService: RaffleContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: ContractSearchDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<[Array<ContractEntity>, number]> {
    return this.raffleContractService.search(dto, merchantEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.raffleContractService.findOne({ id });
  }

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: ContractAutocompleteDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<Array<ContractEntity>> {
    return this.raffleContractService.autocomplete(dto, merchantEntity);
  }
}
