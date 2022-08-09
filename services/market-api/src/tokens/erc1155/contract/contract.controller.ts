import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";
import { SearchDto } from "@gemunion/collection";

import { Erc1155ContractService } from "./contract.service";
import { ContractEntity } from "../../../blockchain/hierarchy/contract/contract.entity";
import { ContractAutocompleteDto } from "../../../blockchain/hierarchy/contract/dto";

@ApiBearerAuth()
@Controller("/erc1155-contracts")
export class Erc1155ContractController {
  constructor(private readonly erc1155ContractService: Erc1155ContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() query: SearchDto): Promise<[Array<ContractEntity>, number]> {
    return this.erc1155ContractService.search(query);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: ContractAutocompleteDto): Promise<Array<ContractEntity>> {
    return this.erc1155ContractService.autocomplete(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.erc1155ContractService.findOne({ id });
  }
}
