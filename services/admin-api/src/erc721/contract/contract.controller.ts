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

import { Erc721CollectionService } from "./contract.service";
import { Erc721CollectionAutocompleteDto, Erc721CollectionSearchDto, Erc721CollectionUpdateDto } from "./dto";
import { UniContractEntity } from "../../blockchain/uni-token/uni-contract.entity";

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
  public autocomplete(@Query() dto: Erc721CollectionAutocompleteDto): Promise<Array<UniContractEntity>> {
    return this.erc721CollectionService.autocomplete(dto);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Erc721CollectionUpdateDto,
  ): Promise<UniContractEntity> {
    return this.erc721CollectionService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<UniContractEntity | null> {
    return this.erc721CollectionService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.erc721CollectionService.delete({ id });
  }
}
