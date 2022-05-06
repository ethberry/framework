import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc721DropboxService } from "./dropbox.service";
import { Erc721DropboxEntity } from "./dropbox.entity";
import { Erc721DropboxSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/erc721-dropboxes")
export class Erc721DropboxController {
  constructor(private readonly erc721DropboxService: Erc721DropboxService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc721DropboxSearchDto): Promise<[Array<Erc721DropboxEntity>, number]> {
    return this.erc721DropboxService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<Erc721DropboxEntity | null> {
    return this.erc721DropboxService.findOne({ id });
  }
}
