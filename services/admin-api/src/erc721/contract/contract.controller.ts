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

import { Erc721ContractService } from "./contract.service";
import { Erc721CollectionAutocompleteDto, Erc721CollectionSearchDto, Erc721CollectionUpdateDto } from "./dto";
import { UniContractEntity } from "../../blockchain/uni-token/uni-contract/uni-contract.entity";

@ApiBearerAuth()
@Controller("/erc721-contracts")
export class Erc721ContractController {
  constructor(private readonly erc721ContractService: Erc721ContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc721CollectionSearchDto): Promise<[Array<UniContractEntity>, number]> {
    return this.erc721ContractService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: Erc721CollectionAutocompleteDto): Promise<Array<UniContractEntity>> {
    return this.erc721ContractService.autocomplete(dto);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Erc721CollectionUpdateDto,
  ): Promise<UniContractEntity> {
    return this.erc721ContractService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<UniContractEntity | null> {
    return this.erc721ContractService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.erc721ContractService.delete({ id });
  }
}
