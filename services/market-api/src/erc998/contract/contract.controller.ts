import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc998CollectionService } from "./contract.service";
import { Erc998CollectionSearchDto } from "./dto";
import { UniContractEntity } from "../../blockchain/uni-token/uni-contract.entity";

@ApiBearerAuth()
@Controller("/erc998-collections")
export class Erc998CollectionController {
  constructor(private readonly erc998CollectionService: Erc998CollectionService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc998CollectionSearchDto): Promise<[Array<UniContractEntity>, number]> {
    return this.erc998CollectionService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<UniContractEntity>> {
    return this.erc998CollectionService.autocomplete();
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<UniContractEntity | null> {
    return this.erc998CollectionService.findOne({ id });
  }
}
