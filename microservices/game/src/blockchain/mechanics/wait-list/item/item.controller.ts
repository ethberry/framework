import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";

import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";
import { WaitListItemService } from "./item.service";
import { WaitListItemEntity } from "./item.entity";
import { WaitListItemCreateDto } from "./dto";

@ApiBearerAuth()
@Controller("/wait-list/item")
export class WaitListItemController {
  constructor(private readonly waitListItemService: WaitListItemService) {}

  @Post("/")
  public create(
    @Body() dto: WaitListItemCreateDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<WaitListItemEntity> {
    return this.waitListItemService.createItem(dto, merchantEntity);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number, @User() merchantEntity: MerchantEntity): Promise<void> {
    await this.waitListItemService.delete({ id }, merchantEntity);
  }
}
