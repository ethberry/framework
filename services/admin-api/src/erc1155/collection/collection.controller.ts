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

import { Erc1155CollectionService } from "./collection.service";
import { Erc1155CollectionEntity } from "./collection.entity";
import { Erc1155CollectionSearchDto, Erc1155CollectionUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/erc1155-collections")
export class Erc1155CollectionController {
  constructor(private readonly erc1155CollectionService: Erc1155CollectionService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc1155CollectionSearchDto): Promise<[Array<Erc1155CollectionEntity>, number]> {
    return this.erc1155CollectionService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<Erc1155CollectionEntity>> {
    return this.erc1155CollectionService.autocomplete();
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Erc1155CollectionUpdateDto,
  ): Promise<Erc1155CollectionEntity | null> {
    return this.erc1155CollectionService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<Erc1155CollectionEntity | null> {
    return this.erc1155CollectionService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.erc1155CollectionService.delete({ id });
  }
}
