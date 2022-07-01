import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc1155ContractService } from "./contract.service";
import { ContractEntity } from "../../blockchain/hierarchy/contract/contract.entity";
import { ContractSearchDto } from "../../blockchain/hierarchy/contract/dto/search";
import { ContractUpdateDto } from "../../blockchain/hierarchy/contract/dto/update";

@ApiBearerAuth()
@Controller("/erc1155-contracts")
export class Erc1155ContractController {
  constructor(private readonly erc1155CollectionService: Erc1155ContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: ContractSearchDto): Promise<[Array<ContractEntity>, number]> {
    return this.erc1155CollectionService.search(dto);
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: ContractUpdateDto): Promise<ContractEntity | null> {
    return this.erc1155CollectionService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.erc1155CollectionService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.erc1155CollectionService.delete({ id });
  }
}
