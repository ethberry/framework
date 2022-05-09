import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc721DropboxService } from "./dropbox.service";
import { Erc721DropboxEntity } from "./dropbox.entity";
import { Erc721DropboxCreateDto, Erc721DropboxSearchDto, Erc721DropboxUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/erc721-dropboxes")
export class Erc721DropboxController {
  constructor(private readonly erc721DropboxService: Erc721DropboxService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc721DropboxSearchDto): Promise<[Array<Erc721DropboxEntity>, number]> {
    return this.erc721DropboxService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<Erc721DropboxEntity>> {
    return this.erc721DropboxService.autocomplete();
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Erc721DropboxUpdateDto,
  ): Promise<Erc721DropboxEntity> {
    return this.erc721DropboxService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<Erc721DropboxEntity | null> {
    return this.erc721DropboxService.findOne({ id });
  }

  @Post("/")
  public create(@Body() dto: Erc721DropboxCreateDto): Promise<Erc721DropboxEntity> {
    return this.erc721DropboxService.create(dto);
  }

  @Delete("/:id")
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<Erc721DropboxEntity> {
    return this.erc721DropboxService.delete({ id });
  }
}
