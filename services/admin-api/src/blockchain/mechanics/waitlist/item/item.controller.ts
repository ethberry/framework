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
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { WaitListItemService } from "./item.service";
import { WaitListItemEntity } from "./item.entity";
import { WaitListItemCreateDto, WaitListSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/waitlist/item")
export class WaitListItemController {
  constructor(private readonly waitlistItemService: WaitListItemService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: WaitListSearchDto): Promise<[Array<WaitListItemEntity>, number]> {
    return this.waitlistItemService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: WaitListItemCreateDto): Promise<WaitListItemEntity> {
    return this.waitlistItemService.create(dto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.waitlistItemService.delete({ id });
  }
}
