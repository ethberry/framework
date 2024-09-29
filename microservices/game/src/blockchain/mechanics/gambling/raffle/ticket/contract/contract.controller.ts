import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@ethberry/nest-js-utils";

import { ContractAutocompleteDto, ContractSearchDto } from "../../../../../hierarchy/contract/dto";
import { ContractEntity } from "../../../../../hierarchy/contract/contract.entity";
import { MerchantEntity } from "../../../../../../infrastructure/merchant/merchant.entity";
import { RaffleTicketContractService } from "./contract.service";

@ApiBearerAuth()
@Controller("/raffle/ticket/contracts")
export class RaffleTicketContractController {
  constructor(private readonly raffleTicketContractService: RaffleTicketContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: ContractSearchDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<[Array<ContractEntity>, number]> {
    return this.raffleTicketContractService.search(dto, merchantEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.raffleTicketContractService.findOne({ id });
  }

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: ContractAutocompleteDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<Array<ContractEntity>> {
    return this.raffleTicketContractService.autocomplete(dto, merchantEntity);
  }
}
