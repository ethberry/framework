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

import { WaitlistItemService } from "./item.service";
import { WaitlistItemEntity } from "./item.entity";
import { WaitlistItemCreateDto, WaitlistSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/waitlist/item")
export class WaitlistItemController {
  constructor(private readonly waitlistItemService: WaitlistItemService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: WaitlistSearchDto): Promise<[Array<WaitlistItemEntity>, number]> {
    return this.waitlistItemService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: WaitlistItemCreateDto): Promise<WaitlistItemEntity> {
    return this.waitlistItemService.create(dto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.waitlistItemService.delete({ id });
  }
}
