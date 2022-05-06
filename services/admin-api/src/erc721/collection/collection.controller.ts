import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc721CollectionService } from "./collection.service";
import { Erc721CollectionEntity } from "./collection.entity";
import {
  Erc721CollectionAutocompleteDto,
  Erc721CollectionCreateDto,
  Erc721CollectionSearchDto,
  Erc721CollectionUpdateDto,
} from "./dto";

@ApiBearerAuth()
@Controller("/erc721-collections")
export class Erc721CollectionController {
  constructor(private readonly erc721CollectionService: Erc721CollectionService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc721CollectionSearchDto): Promise<[Array<Erc721CollectionEntity>, number]> {
    return this.erc721CollectionService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: Erc721CollectionAutocompleteDto): Promise<Array<Erc721CollectionEntity>> {
    return this.erc721CollectionService.autocomplete(dto);
  }

  @Post("/")
  public create(@Body() dto: Erc721CollectionCreateDto): Promise<Erc721CollectionEntity> {
    return this.erc721CollectionService.create(dto);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Erc721CollectionUpdateDto,
  ): Promise<Erc721CollectionEntity> {
    return this.erc721CollectionService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<Erc721CollectionEntity | null> {
    return this.erc721CollectionService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.erc721CollectionService.delete({ id });
  }
}
