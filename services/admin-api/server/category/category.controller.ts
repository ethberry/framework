import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";
import { SearchDto } from "@gemunion/collection";

import { CategoryService } from "./category.service";
import { CategoryEntity } from "./category.entity";
import { CategoryCreateDto, CategoryUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() query: SearchDto): Promise<[Array<CategoryEntity>, number]> {
    return this.categoryService.search(query);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<CategoryEntity>> {
    return this.categoryService.autocomplete();
  }

  @Post("/")
  public create(@Body() body: CategoryCreateDto): Promise<CategoryEntity> {
    return this.categoryService.create(body);
  }

  @Put("/:id")
  public update(@Param("id") id: number, @Body() body: CategoryUpdateDto): Promise<CategoryEntity | undefined> {
    return this.categoryService.update({ id }, body);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id") id: number): Promise<CategoryEntity | undefined> {
    return this.categoryService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(204)
  public async delete(@Param("id") id: number): Promise<void> {
    await this.categoryService.delete({ id });
  }
}
