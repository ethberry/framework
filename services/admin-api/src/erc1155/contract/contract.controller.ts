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
import { Erc1155CollectionAutocompleteDto, Erc1155CollectionSearchDto, Erc1155CollectionUpdateDto } from "./dto";
import { UniContractEntity } from "../../blockchain/uni-token/uni-contract/uni-contract.entity";

@ApiBearerAuth()
@Controller("/erc1155-contracts")
export class Erc1155ContractController {
  constructor(private readonly erc1155CollectionService: Erc1155ContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc1155CollectionSearchDto): Promise<[Array<UniContractEntity>, number]> {
    return this.erc1155CollectionService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: Erc1155CollectionAutocompleteDto): Promise<Array<UniContractEntity>> {
    return this.erc1155CollectionService.autocomplete(dto);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Erc1155CollectionUpdateDto,
  ): Promise<UniContractEntity | null> {
    return this.erc1155CollectionService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<UniContractEntity | null> {
    return this.erc1155CollectionService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.erc1155CollectionService.delete({ id });
  }
}
