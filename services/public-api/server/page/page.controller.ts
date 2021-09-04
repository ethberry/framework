import { Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor } from "@gemunion/nest-js-utils";

import { PageService } from "./page.service";
import { PageEntity } from "./page.entity";

@ApiBearerAuth()
@Controller("/pages")
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Get("/:slug")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("slug") slug: string): Promise<PageEntity | undefined> {
    return this.pageService.findOne({ slug });
  }
}
