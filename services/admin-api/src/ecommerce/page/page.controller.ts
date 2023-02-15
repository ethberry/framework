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

import { PageService } from "./page.service";
import { PageEntity } from "./page.entity";
import { PageCreateDto, PageSearchDto, PageUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/pages")
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PageSearchDto): Promise<[Array<PageEntity>, number]> {
    return this.pageService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: PageCreateDto): Promise<PageEntity> {
    return this.pageService.create(dto);
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: PageUpdateDto): Promise<PageEntity> {
    return this.pageService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<PageEntity | null> {
    return this.pageService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.pageService.delete({ id });
  }
}
