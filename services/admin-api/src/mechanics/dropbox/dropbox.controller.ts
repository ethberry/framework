import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { DropboxService } from "./dropbox.service";
import { DropboxEntity } from "./dropbox.entity";
import { DropboxCreateDto, DropboxSearchDto, DropboxUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/dropboxes")
export class DropboxController {
  constructor(private readonly dropboxService: DropboxService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: DropboxSearchDto): Promise<[Array<DropboxEntity>, number]> {
    return this.dropboxService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<DropboxEntity>> {
    return this.dropboxService.autocomplete();
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: DropboxUpdateDto): Promise<DropboxEntity> {
    return this.dropboxService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<DropboxEntity | null> {
    return this.dropboxService.findOne({ id });
  }

  @Post("/")
  public create(@Body() dto: DropboxCreateDto): Promise<DropboxEntity> {
    return this.dropboxService.create(dto);
  }

  @Delete("/:id")
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<DropboxEntity> {
    return this.dropboxService.delete({ id });
  }
}
