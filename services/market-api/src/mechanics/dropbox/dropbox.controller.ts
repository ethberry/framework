import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { DropboxService } from "./dropbox.service";
import { DropboxEntity } from "./dropbox.entity";
import { DropboxSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/dropboxes")
export class DropboxController {
  constructor(private readonly dropboxService: DropboxService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: DropboxSearchDto): Promise<[Array<DropboxEntity>, number]> {
    return this.dropboxService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<DropboxEntity | null> {
    return this.dropboxService.findOne({ id });
  }
}
