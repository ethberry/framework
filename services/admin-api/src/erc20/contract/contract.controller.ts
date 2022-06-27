import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc20ContractService } from "./contract.service";
import { Erc20ContractAutocompleteDto, Erc20TokenCreateDto, Erc20TokenSearchDto, Erc20TokenUpdateDto } from "./dto";
import { UniTemplateEntity } from "../../uni-token/uni-template.entity";

@ApiBearerAuth()
@Controller("/erc20-tokens")
export class Erc20TokenController {
  constructor(private readonly erc20TokenService: Erc20ContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc20TokenSearchDto): Promise<[Array<UniTemplateEntity>, number]> {
    return this.erc20TokenService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: Erc20TokenCreateDto): Promise<UniTemplateEntity> {
    return this.erc20TokenService.create(dto);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: Erc20ContractAutocompleteDto): Promise<Array<UniTemplateEntity>> {
    return this.erc20TokenService.autocomplete(dto);
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: Erc20TokenUpdateDto): Promise<UniTemplateEntity> {
    return this.erc20TokenService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<UniTemplateEntity | null> {
    return this.erc20TokenService.findOne({ id });
  }

  @Delete("/:id")
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<UniTemplateEntity> {
    return this.erc20TokenService.delete({ id });
  }
}
