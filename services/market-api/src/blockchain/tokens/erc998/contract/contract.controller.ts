import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";
import { SearchDto } from "@gemunion/collection";

import { Erc998ContractService } from "./contract.service";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { ContractAutocompleteDto } from "../../../hierarchy/contract/dto";

@ApiBearerAuth()
@Controller("/erc998-contracts")
export class Erc998ContractController {
  constructor(private readonly erc998CollectionService: Erc998ContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: SearchDto): Promise<[Array<ContractEntity>, number]> {
    return this.erc998CollectionService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: ContractAutocompleteDto): Promise<Array<ContractEntity>> {
    return this.erc998CollectionService.autocomplete(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.erc998CollectionService.findOne({ id });
  }
}
