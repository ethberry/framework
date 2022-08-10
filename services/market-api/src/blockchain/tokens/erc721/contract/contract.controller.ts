import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";
import { SearchDto } from "@gemunion/collection";

import { Erc721ContractService } from "./contract.service";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { ContractAutocompleteDto } from "../../../hierarchy/contract/dto";

@ApiBearerAuth()
@Controller("/erc721-contracts")
export class Erc721ContractController {
  constructor(private readonly erc721ContractService: Erc721ContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: SearchDto): Promise<[Array<ContractEntity>, number]> {
    return this.erc721ContractService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: ContractAutocompleteDto): Promise<Array<ContractEntity>> {
    return this.erc721ContractService.autocomplete(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.erc721ContractService.findOne({ id });
  }
}
