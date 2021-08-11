import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors} from "@nestjs/common";
import {ApiCookieAuth} from "@nestjs/swagger";

import {NotFoundInterceptor, PaginationInterceptor} from "@gemunionstudio/nest-js-providers";

import {PageService} from "./page.service";
import {PageEntity} from "./page.entity";
import {PageCreateDto, PageUpdateDto} from "./dto";

@ApiCookieAuth()
@Controller("/pages")
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(): Promise<[Array<PageEntity>, number]> {
    return this.pageService.search();
  }

  @Post("/")
  public create(@Body() body: PageCreateDto): Promise<PageEntity> {
    return this.pageService.create(body);
  }

  @Put("/:id")
  public update(@Param("id") id: number, @Body() body: PageUpdateDto): Promise<PageEntity> {
    return this.pageService.update({id}, body);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id") id: number): Promise<PageEntity | undefined> {
    return this.pageService.findOne({id});
  }

  @Delete("/:id")
  @HttpCode(204)
  public async delete(@Param("id") id: number): Promise<void> {
    await this.pageService.delete({id});
  }
}
