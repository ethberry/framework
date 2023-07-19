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

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { WaitListItemService } from "./item.service";
import { WaitListItemEntity } from "./item.entity";
import { WaitListItemCreateDto, WaitListSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/wait-list/item")
export class WaitListItemController {
  constructor(private readonly waitListItemService: WaitListItemService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: WaitListSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<WaitListItemEntity>, number]> {
    return this.waitListItemService.search(dto, userEntity);
  }

  @Post("/")
  public create(@Body() dto: WaitListItemCreateDto, @User() userEntity: UserEntity): Promise<WaitListItemEntity> {
    return this.waitListItemService.createItem(dto, userEntity);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.waitListItemService.delete({ id }, userEntity);
  }
}
