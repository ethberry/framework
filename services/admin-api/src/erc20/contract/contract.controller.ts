import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc20ContractService } from "./contract.service";
import {
  Erc20ContractAutocompleteDto,
  Erc20ContractCreateDto,
  Erc20ContractSearchDto,
  Erc20ContractUpdateDto,
} from "./dto";
import { UniContractEntity } from "../../blockchain/uni-token/uni-contract/uni-contract.entity";

@ApiBearerAuth()
@Controller("/erc20-contracts")
export class Erc20TokenController {
  constructor(private readonly erc20ContractService: Erc20ContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc20ContractSearchDto): Promise<[Array<UniContractEntity>, number]> {
    return this.erc20ContractService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: Erc20ContractCreateDto): Promise<UniContractEntity> {
    return this.erc20ContractService.create(dto);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: Erc20ContractAutocompleteDto): Promise<Array<UniContractEntity>> {
    return this.erc20ContractService.autocomplete(dto);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Erc20ContractUpdateDto,
  ): Promise<UniContractEntity> {
    return this.erc20ContractService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<UniContractEntity | null> {
    return this.erc20ContractService.findOne({ id }, { relations: { uniTemplates: true } });
  }

  @Delete("/:id")
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<UniContractEntity> {
    return this.erc20ContractService.delete({ id });
  }
}
