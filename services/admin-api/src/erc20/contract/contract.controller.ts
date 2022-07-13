import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc20ContractService } from "./contract.service";
import { Erc20ContractCreateDto } from "./dto";
import { ContractEntity } from "../../blockchain/hierarchy/contract/contract.entity";
import { ContractSearchDto, ContractUpdateDto } from "../../blockchain/hierarchy/contract/dto";

@ApiBearerAuth()
@Controller("/erc20-contracts")
export class Erc20TokenController {
  constructor(private readonly erc20ContractService: Erc20ContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: ContractSearchDto): Promise<[Array<ContractEntity>, number]> {
    return this.erc20ContractService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: Erc20ContractCreateDto): Promise<ContractEntity> {
    return this.erc20ContractService.create(dto);
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: ContractUpdateDto): Promise<ContractEntity> {
    return this.erc20ContractService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.erc20ContractService.findOne({ id }, { relations: { templates: true } });
  }

  @Delete("/:id")
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity> {
    return this.erc20ContractService.delete({ id });
  }
}
