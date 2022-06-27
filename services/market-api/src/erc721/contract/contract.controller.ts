import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc721CollectionService } from "./contract.service";
import { Erc721CollectionSearchDto } from "./dto";
import { UniContractEntity } from "../../uni-token/uni-contract.entity";

@ApiBearerAuth()
@Controller("/erc721-collections")
export class Erc721CollectionController {
  constructor(private readonly erc721CollectionService: Erc721CollectionService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc721CollectionSearchDto): Promise<[Array<UniContractEntity>, number]> {
    return this.erc721CollectionService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<UniContractEntity>> {
    return this.erc721CollectionService.autocomplete();
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<UniContractEntity | null> {
    return this.erc721CollectionService.findOne({ id });
  }
}
