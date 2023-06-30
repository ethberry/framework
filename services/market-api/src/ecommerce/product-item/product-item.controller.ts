import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { ProductItemService } from "./product-item.service";
import { ProductItemEntity } from "./product-item.entity";
import { ProductItemSearchDto } from "./dto";
import { UserEntity } from "../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/product-item")
export class ProductItemController {
  constructor(private readonly productItemService: ProductItemService) {}

  @Get("/autocomplete")
  public autocomplete(@User() userEntity: UserEntity): Promise<Array<ProductItemEntity>> {
    return this.productItemService.autocomplete(userEntity);
  }

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: ProductItemSearchDto): Promise<[Array<ProductItemEntity>, number]> {
    return this.productItemService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ProductItemEntity | null> {
    return this.productItemService.findOneWithRelations({ id });
  }
}
