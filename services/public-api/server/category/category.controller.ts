import { Controller, Get, UseInterceptors } from "@nestjs/common";

import { PaginationInterceptor, Public } from "@gemunionstudio/nest-js-utils";

import { CategoryService } from "./category.service";
import { CategoryEntity } from "./category.entity";

@Public()
@Controller("/categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(): Promise<[Array<CategoryEntity>, number]> {
    return this.categoryService.findAndCount({});
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<CategoryEntity>> {
    return this.categoryService.autocomplete();
  }
}
