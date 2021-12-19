import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { PageService } from "./page.service";
import { PageEntity } from "./page.entity";
import { PageCreateDto, PageUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/pages")
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(): Promise<[Array<PageEntity>, number]> {
    return this.pageService.search();
  }

  @Post("/")
  public create(@Body() dto: PageCreateDto): Promise<PageEntity> {
    return this.pageService.create(dto);
  }

  @Put("/:id")
  public update(@Param("id") id: number, @Body() dto: PageUpdateDto): Promise<PageEntity> {
    return this.pageService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id") id: number): Promise<PageEntity | undefined> {
    return this.pageService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(204)
  public async delete(@Param("id") id: number): Promise<void> {
    await this.pageService.delete({ id });
  }
}
