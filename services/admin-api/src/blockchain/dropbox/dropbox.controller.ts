import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc998DropboxService } from "./dropbox.service";
import { DropboxEntity } from "./dropbox.entity";
import { Erc998DropboxCreateDto, DropboxSearchDto, Erc998DropboxUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/erc998-dropboxes")
export class Erc998DropboxController {
  constructor(private readonly erc998DropboxService: Erc998DropboxService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: DropboxSearchDto): Promise<[Array<DropboxEntity>, number]> {
    return this.erc998DropboxService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<DropboxEntity>> {
    return this.erc998DropboxService.autocomplete();
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Erc998DropboxUpdateDto,
  ): Promise<DropboxEntity> {
    return this.erc998DropboxService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<DropboxEntity | null> {
    return this.erc998DropboxService.findOne({ id });
  }

  @Post("/")
  public create(@Body() dto: Erc998DropboxCreateDto): Promise<DropboxEntity> {
    return this.erc998DropboxService.create(dto);
  }

  @Delete("/:id")
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<DropboxEntity> {
    return this.erc998DropboxService.delete({ id });
  }
}
