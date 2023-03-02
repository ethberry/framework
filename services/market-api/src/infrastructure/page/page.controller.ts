import { Controller, Get, Param, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, Public } from "@gemunion/nest-js-utils";

import { PageService } from "./page.service";
import { PageEntity } from "./page.entity";

@Controller("/pages")
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Public()
  @Get("/:slug")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("slug") slug: string): Promise<PageEntity | null> {
    return this.pageService.findOne({ slug });
  }
}
