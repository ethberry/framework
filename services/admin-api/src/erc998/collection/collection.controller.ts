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

import { Erc998CollectionService } from "./collection.service";
import { Erc998CollectionEntity } from "./collection.entity";
import { Erc998CollectionAutocompleteDto, Erc998CollectionSearchDto, Erc998CollectionUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/erc998-collections")
export class Erc998CollectionController {
  constructor(private readonly erc998CollectionService: Erc998CollectionService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc998CollectionSearchDto): Promise<[Array<Erc998CollectionEntity>, number]> {
    return this.erc998CollectionService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: Erc998CollectionAutocompleteDto): Promise<Array<Erc998CollectionEntity>> {
    return this.erc998CollectionService.autocomplete(dto);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Erc998CollectionUpdateDto,
  ): Promise<Erc998CollectionEntity> {
    return this.erc998CollectionService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<Erc998CollectionEntity | null> {
    return this.erc998CollectionService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.erc998CollectionService.delete({ id });
  }
}
