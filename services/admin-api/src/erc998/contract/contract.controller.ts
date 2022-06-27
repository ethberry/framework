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

import { Erc998CollectionService } from "./contract.service";
import { Erc998CollectionAutocompleteDto, Erc998CollectionSearchDto, Erc998CollectionUpdateDto } from "./dto";
import { UniContractEntity } from "../../uni-token/uni-contract.entity";

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
  public autocomplete(@Query() dto: Erc998CollectionAutocompleteDto): Promise<Array<UniContractEntity>> {
    return this.erc998CollectionService.autocomplete(dto);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Erc998CollectionUpdateDto,
  ): Promise<UniContractEntity> {
    return this.erc998CollectionService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<UniContractEntity | null> {
    return this.erc998CollectionService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.erc998CollectionService.delete({ id });
  }
}
