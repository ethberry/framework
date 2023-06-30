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
  public search(@Query() dto: SearchDto): Promise<[Array<CategoryEntity>, number]> {
    return this.categoryService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<CategoryEntity>> {
    return this.categoryService.autocomplete();
  }

  @Post("/")
  public create(@Body() dto: CategoryCreateDto): Promise<CategoryEntity> {
    return this.categoryService.create(dto);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: CategoryUpdateDto,
  ): Promise<CategoryEntity | undefined> {
    return this.categoryService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<CategoryEntity | null> {
    return this.categoryService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.categoryService.delete({ id });
  }
}
